'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PortfolioItemWithValue, UpdatePortfolioItemDto } from '@/types';

const editAssetSchema = z.object({
  purchasePrice: z.number().positive('Purchase price must be positive'),
  quantity: z.number().int().positive('Quantity must be positive'),
});

type EditAssetFormData = z.infer<typeof editAssetSchema>;

interface EditAssetModalProps {
  isOpen: boolean;
  item: PortfolioItemWithValue;
  onClose: () => void;
  onSubmit: (data: UpdatePortfolioItemDto) => Promise<{ success: boolean; error?: string }>;
}

export default function EditAssetModal({
  isOpen,
  item,
  onClose,
  onSubmit,
}: EditAssetModalProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditAssetFormData>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: {
      purchasePrice: item.purchasePrice,
      quantity: item.quantity,
    },
  });

  useEffect(() => {
    reset({
      purchasePrice: item.purchasePrice,
      quantity: item.quantity,
    });
  }, [item, reset]);

  const quantity = watch('quantity');
  const purchasePrice = watch('purchasePrice');

  const totalCost = quantity * purchasePrice;
  const currentValue = quantity * item.currentPrice;
  const profitLoss = currentValue - totalCost;
  const profitLossPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  const handleFormSubmit = async (data: EditAssetFormData) => {
    setError(null);
    const result = await onSubmit(data);
    if (!result.success) {
      setError(result.error || 'Failed to update asset');
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  const isProfit = profitLoss >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Asset</h2>
          <button
            onClick={() => {
              if (isDirty && !confirm('Discard unsaved changes?')) return;
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Asset Info */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
              {item.symbol[0]}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.symbol}</p>
              <p className="text-sm text-gray-500">{item.name}</p>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
              {item.assetType}
            </span>
          </div>

          {/* Market Info */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg text-sm">
            <div>
              <p className="text-gray-500">Current Price</p>
              <p className="font-medium">${item.currentPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500">Current Value</p>
              <p className="font-medium">${currentValue.toFixed(2)}</p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              step="1"
              className="input"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Purchase Price ($)</label>
            <input
              type="number"
              step="0.01"
              className="input"
              {...register('purchasePrice', { valueAsNumber: true })}
            />
            {errors.purchasePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.purchasePrice.message}</p>
            )}
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span>Total Cost</span>
              <span className="font-medium">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Profit / Loss</span>
              <span className={`font-medium flex items-center gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                ${profitLoss.toFixed(2)} ({profitLossPct.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
