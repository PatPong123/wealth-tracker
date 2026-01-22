import api from '@/lib/api';
import type {
  PortfolioItem,
  PortfolioItemWithValue,
  PortfolioSummary,
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
} from '@/types';

export const portfolioService = {
  async getAll(): Promise<PortfolioItemWithValue[]> {
    const response = await api.get<PortfolioItemWithValue[]>('/portfolio');
    return response.data;
  },

  async getSummary(): Promise<PortfolioSummary> {
    const response = await api.get<PortfolioSummary>('/portfolio/summary');
    return response.data;
  },

  async getById(id: string): Promise<PortfolioItemWithValue> {
    const response = await api.get<PortfolioItemWithValue>(`/portfolio/${id}`);
    return response.data;
  },

  async create(data: CreatePortfolioItemDto): Promise<PortfolioItem> {
    const response = await api.post<PortfolioItem>('/portfolio', data);
    return response.data;
  },

  async update(id: string, data: UpdatePortfolioItemDto): Promise<PortfolioItem> {
    const response = await api.patch<PortfolioItem>(`/portfolio/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/portfolio/${id}`);
  },
};

export default portfolioService;
