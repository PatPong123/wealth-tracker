'use client';

import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '@/services';
import type { PortfolioSummary, CreatePortfolioItemDto, UpdatePortfolioItemDto } from '@/types';
import { getErrorMessage } from '@/lib/api';
import Cookies from 'js-cookie';
export function usePortfolio() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await portfolioService.getSummary();
      setSummary(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(async (data: CreatePortfolioItemDto) => {
    try {
      await portfolioService.create(data);
      await fetchSummary();
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  }, [fetchSummary]);

  const updateItem = useCallback(async (id: string, data: UpdatePortfolioItemDto) => {
    try {
      await portfolioService.update(id, data);
      await fetchSummary();
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  }, [fetchSummary]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await portfolioService.delete(id);
      await fetchSummary();
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  }, [fetchSummary]);

 useEffect(() => {
  const token = Cookies.get('token');
  if (!token) return;

  fetchSummary();
}, [fetchSummary]);

  return {
    summary,
    isLoading,
    error,
    refetch: fetchSummary,
    addItem,
    updateItem,
    deleteItem,
  };
}

export default usePortfolio;
