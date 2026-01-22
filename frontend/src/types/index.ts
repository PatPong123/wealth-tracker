// User types
export interface User {
  id: string;
  username: string;
  email: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email?: string;
  password: string;
}

// Asset types
export interface Asset {
  symbol: string;
  name: string;
  price: number;
  type: string;
  change?: number;
  changePercent?: number;
}

export interface AssetsResponse {
  success: boolean;
  count: number;
  data: Asset[];
}

// Portfolio types
export interface PortfolioItem {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  assetType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItemWithValue extends PortfolioItem {
  currentPrice: number;
  currentValue: number;
  totalCost: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface AssetAllocation {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
}

export interface PortfolioSummary {
  totalBalance: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  activeAssets: number;
  allocation: AssetAllocation[];
  items: PortfolioItemWithValue[];
}

export interface CreatePortfolioItemDto {
  symbol: string;
  purchasePrice: number;
  quantity: number;
}

export interface UpdatePortfolioItemDto {
  symbol?: string;
  purchasePrice?: number;
  quantity?: number;
}

// API Response types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
