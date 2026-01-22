import { PortfolioItem } from '@prisma/client';

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
