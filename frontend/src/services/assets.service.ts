import api from '@/lib/api';
import type { Asset, AssetsResponse } from '@/types';

export const assetsService = {
  async getAll(): Promise<Asset[]> {
    const response = await api.get<AssetsResponse>('/assets');
    return response.data.data;
  },

  async search(query: string): Promise<Asset[]> {
    const response = await api.get<AssetsResponse>('/assets/search', {
      params: { q: query },
    });
    return response.data.data;
  },

  async getBySymbol(symbol: string): Promise<Asset | null> {
    const response = await api.get<AssetsResponse>(`/assets/symbol/${symbol}`);
    return response.data.data[0] || null;
  },

  async getByType(type: string): Promise<Asset[]> {
    const response = await api.get<AssetsResponse>(`/assets/type/${type}`);
    return response.data.data;
  },
};

export default assetsService;
