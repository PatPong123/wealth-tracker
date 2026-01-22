'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { generateChartColors, formatCurrency, formatPercentage } from '@/lib/utils';
import type { AssetAllocation } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationChartProps {
  allocation: AssetAllocation[];
}

export default function AllocationChart({ allocation }: AllocationChartProps) {
  if (allocation.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No assets to display
      </div>
    );
  }

  const colors = generateChartColors(allocation.length);

  const data: ChartData<'doughnut'> = {
    labels: allocation.map((item) => item.symbol),
    datasets: [
      {
        data: allocation.map((item) => item.value),
        backgroundColor: colors,
        borderColor: colors.map((color) => color),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = allocation[context.dataIndex];
            return `${item.symbol}: ${formatCurrency(item.value)} (${item.percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="h-48">
        <Doughnut data={data} options={options} />
      </div>
      
      {/* Legend */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {allocation.map((item, index) => (
          <div key={item.symbol} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-gray-700">{item.symbol}</span>
            </div>
            <span className="text-gray-500">{item.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
