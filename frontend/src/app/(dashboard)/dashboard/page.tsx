'use client';

import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
import { usePortfolio } from '@/hooks';
import { formatCurrency, formatPercentage, getProfitLossColor, getProfitLossBgColor } from '@/lib/utils';
import SummaryCard from '@/components/ui/SummaryCard';
import PortfolioTable from '@/components/portfolio/PortfolioTable';
import AllocationChart from '@/components/charts/AllocationChart';
import AddAssetModal from '@/components/portfolio/AddAssetModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { summary, isLoading, error, refetch, addItem, deleteItem } = usePortfolio();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={refetch} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const profitLossIcon = (summary?.totalProfitLoss ?? 0) >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your portfolio performance</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Asset
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(summary?.totalBalance ?? 0)}
          icon={Wallet}
          iconColor="text-primary-600"
          iconBgColor="bg-primary-100"
        />
        <SummaryCard
          title="Total Profit/Loss"
          value={formatCurrency(Math.abs(summary?.totalProfitLoss ?? 0))}
          subtitle={formatPercentage(summary?.totalProfitLossPercentage ?? 0)}
          icon={profitLossIcon}
          iconColor={(summary?.totalProfitLoss ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}
          iconBgColor={(summary?.totalProfitLoss ?? 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}
          valueColor={getProfitLossColor(summary?.totalProfitLoss ?? 0)}
          prefix={(summary?.totalProfitLoss ?? 0) >= 0 ? '+' : '-'}
        />
        <SummaryCard
          title="Active Assets"
          value={String(summary?.activeAssets ?? 0)}
          icon={PieChart}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Charts and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Table */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Portfolio</h2>
            </div>
            <PortfolioTable
              items={summary?.items ?? []}
              onDelete={async (id) => {
                await deleteItem(id);
              }}
            />
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h2>
            <AllocationChart allocation={summary?.allocation ?? []} />
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data) => {
          const result = await addItem(data);
          if (result.success) {
            setIsAddModalOpen(false);
          }
          return result;
        }}
      />
    </div>
  );
}
