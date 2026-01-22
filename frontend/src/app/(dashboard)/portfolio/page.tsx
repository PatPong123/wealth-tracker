'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { usePortfolio } from '@/hooks';
import { formatCurrency, formatPercentage, getProfitLossColor } from '@/lib/utils';
import AddAssetModal from '@/components/portfolio/AddAssetModal';
import EditAssetModal from '@/components/portfolio/EditAssetModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { PortfolioItemWithValue, UpdatePortfolioItemDto } from '@/types';

export default function PortfolioPage() {
  const { summary, isLoading, error, refetch, addItem, updateItem, deleteItem } = usePortfolio();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItemWithValue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const filteredItems = summary?.items.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirm(null);
  };

  const handleUpdate = async (id: string, data: UpdatePortfolioItemDto) => {
    const result = await updateItem(id, data);
    if (result.success) {
      setEditingItem(null);
    }
    return result;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600">Manage your investment assets</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Asset
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Portfolio Grid */}
      {filteredItems.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'No assets found matching your search.' : 'No assets in your portfolio yet.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Asset
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {item.symbol.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{item.symbol}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-[150px]">{item.name}</p>
                  </div>
                </div>
                {item.assetType && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {item.assetType}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current Price</span>
                  <span className="font-medium">{formatCurrency(item.currentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Holdings</span>
                  <span className="font-medium">{item.quantity} @ {formatCurrency(item.purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current Value</span>
                  <span className="font-medium">{formatCurrency(item.currentValue)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-gray-500">Profit/Loss</span>
                  <div className="text-right">
                    <span className={`font-semibold ${getProfitLossColor(item.profitLoss)}`}>
                      {item.profitLoss >= 0 ? '+' : ''}{formatCurrency(item.profitLoss)}
                    </span>
                    <span className={`text-sm ml-1 ${getProfitLossColor(item.profitLossPercentage)}`}>
                      ({formatPercentage(item.profitLossPercentage)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => setEditingItem(item)}
                  className="btn-secondary flex-1 text-sm py-2"
                >
                  Edit
                </button>
                {deleteConfirm === item.id ? (
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-danger flex-1 text-sm py-2"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="btn-secondary flex-1 text-sm py-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="btn-danger flex-1 text-sm py-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* Edit Asset Modal */}
      {editingItem && (
        <EditAssetModal
          isOpen={!!editingItem}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) => handleUpdate(editingItem.id, data)}
        />
      )}
    </div>
  );
}
