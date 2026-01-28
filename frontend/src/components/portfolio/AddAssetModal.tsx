'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Search } from 'lucide-react';
import { assetsService } from '@/services';
import type { Asset, CreatePortfolioItemDto } from '@/types';

const addAssetSchema = z.object({
  symbol: z.string().min(1, 'Please select an asset'),
  purchasePrice: z.number().positive('Purchase price must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
});

type AddAssetFormData = z.infer<typeof addAssetSchema>;

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePortfolioItemDto) => Promise<{ success: boolean; error?: string }>;
}

export default function AddAssetModal({ isOpen, onClose, onSubmit }: AddAssetModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCurrentPrice, setUseCurrentPrice] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddAssetFormData>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: {
      symbol: '',
      purchasePrice: undefined,
      quantity: undefined,
    },
  });

  const purchasePrice = watch('purchasePrice');
  const quantity = watch('quantity');
  const totalValue = (purchasePrice || 0) * (quantity || 0);

  // Search assets
  const searchAssets = useCallback(async (query: string) => {
    setIsSearching(true);
    try {

      const results = await assetsService.search(query || '');
      setSearchResults(results.slice(0, 10));
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAssets(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAssets]);

  // Select asset
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setSearchQuery(asset.symbol);

    setValue('symbol', asset.symbol, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (useCurrentPrice) {
      setValue('purchasePrice', asset.price, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    setShowDropdown(false);
  };

  // Update price when toggle changes
  useEffect(() => {
    if (useCurrentPrice && selectedAsset) {
      setValue('purchasePrice', selectedAsset.price);
    }
  }, [useCurrentPrice, selectedAsset, setValue]);

  // Handle form submit
  const handleFormSubmit = async (data: AddAssetFormData) => {
    setError(null);
    const result = await onSubmit(data);
    if (!result.success) {
      setError(result.error || 'Failed to add asset');
    } else {
      handleClose();
    }
  };

  // Reset on close
  const handleClose = () => {
    reset();
    setSearchQuery('');
    setSelectedAsset(null);
    setSearchResults([]);
    setError(null);
    setUseCurrentPrice(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add New Asset</h2>
          <button
            onClick={handleClose}
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

          {/* Asset Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symbol
            </label>
            <p className="text-xs text-gray-500 mb-2">E.G. AAPL, BTC</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  setShowDropdown(true);
                  searchAssets('');
                }}
                placeholder="Try AAPL, TSLA, BTC, ETH, MSFT"
                className="input pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
              )}
            </div>
            <input type="hidden" defaultValue=""{...register('symbol')} />
            {errors.symbol && (
              <p className="mt-1 text-sm text-red-600">{errors.symbol.message}</p>
            )}

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((asset) => (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => handleSelectAsset(asset)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{asset.symbol}</p>
                      <p className="text-sm text-gray-500">{asset.name}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${asset.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Asset Info */}
          {selectedAsset && (
            <div className="p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedAsset.symbol}</p>
                  <p className="text-sm text-gray-600">{selectedAsset.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${selectedAsset.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{selectedAsset.type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              step="any"
              placeholder="0"
              className="input"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Buy Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buy Price ($)
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              className="input"
              {...register('purchasePrice', { valueAsNumber: true })}
            />
            {errors.purchasePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.purchasePrice.message}</p>
            )}
          </div>

          {/* Use current price toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCurrentPrice}
              onChange={(e) => setUseCurrentPrice(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">
              Current market price fetched automatically
            </span>
          </label>
          {quantity > 0 && purchasePrice > 0 && (
            <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Total Value</span>
                <span className="text-lg font-bold text-primary-600">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedAsset}
              className="btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Adding...
                </>
              ) : (
                'Add to Portfolio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
