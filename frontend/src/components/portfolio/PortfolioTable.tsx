'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatPercentage, getProfitLossColor } from '@/lib/utils';
import type { PortfolioItemWithValue } from '@/types';

interface PortfolioTableProps {
  items: PortfolioItemWithValue[];
  onEdit?: (item: PortfolioItemWithValue) => void;
  onDelete?: (id: string) => void;
}

export default function PortfolioTable({ items, onEdit, onDelete }: PortfolioTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No assets in your portfolio yet. Add your first asset to get started.
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete?.(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Asset</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Price</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Holdings</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Value</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">P/L</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                    {item.symbol.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{item.symbol}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">{item.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                <p className="font-medium text-gray-900">{formatCurrency(item.currentPrice)}</p>
                <p className="text-xs text-gray-500">@ {formatCurrency(item.purchasePrice)}</p>
              </td>
              <td className="py-4 px-4 text-right">
                <p className="font-medium text-gray-900">{item.quantity}</p>
              </td>
              <td className="py-4 px-4 text-right">
                <p className="font-medium text-gray-900">{formatCurrency(item.currentValue)}</p>
              </td>
              <td className="py-4 px-4 text-right">
                <p className={`font-medium ${getProfitLossColor(item.profitLoss)}`}>
                  {item.profitLoss >= 0 ? '+' : ''}{formatCurrency(item.profitLoss)}
                </p>
                <p className={`text-xs ${getProfitLossColor(item.profitLossPercentage)}`}>
                  {formatPercentage(item.profitLossPercentage)}
                </p>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        deleteConfirm === item.id
                          ? 'text-white bg-red-500 hover:bg-red-600'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={deleteConfirm === item.id ? 'Click again to confirm' : 'Delete'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
