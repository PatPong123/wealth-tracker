'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { PortfolioItemWithValue, UpdatePortfolioItemDto } from '@/types';

const editAssetSchema = z.object({
  purchasePrice: z.number().positive('Purchase price must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
});

type EditAssetFormData = z.infer<typeof editAssetSchema>;

interface EditAssetModalProps {
  isOpen: boolean;
  item: PortfolioItemWithValue;
  onClose: () => void;
  onSubmit: (data: UpdatePortfolioItemDto) => Promise<{ success: boolean; error?: string }>;
}

export default function EditAssetModal({ isOpen, item, onClose, onSubmit }: EditAssetModalProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditAssetFormData>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: {
      purchasePrice: item.purchasePrice,
      quantity: item.quantity,
    },
  });

  const handleFormSubmit = async (data: EditAssetFormData) => {
    setError(null);
    const result = await onSubmit(data);
    if (!result.success) {
      setError(result.error || 'Failed to update asset');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Asset</h2>
          <button
            onClick={onClose}
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
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                {item.symbol.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{item.symbol}</p>
                <p className="text-sm text-gray-500">{item.name}</p>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              step="any"
              className="input"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price ($)
            </label>
            <input
              type="number"
              step="any"
              className="input"
              {...register('purchasePrice', { valueAsNumber: true })}
            />
            {errors.purchasePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.purchasePrice.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
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
