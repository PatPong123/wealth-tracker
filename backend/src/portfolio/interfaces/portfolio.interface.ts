import { Prisma } from '@prisma/client'

export type PortfolioItem = Prisma.PortfolioItemGetPayload<{
  select: {
    id: true
    userId: true
    symbol: true
    name: true
    purchasePrice: true
    quantity: true
    assetType: true
    createdAt: true
    updatedAt: true
  }
}>

export type PortfolioItemWithValue = PortfolioItem & {
  currentPrice: number
  currentValue: number
  totalCost: number
  profitLoss: number
  profitLossPercentage: number
}

export interface AssetAllocation {
  symbol: string
  name: string
  value: number
  percentage: number
}

export interface PortfolioSummary {
  totalBalance: number
  totalCost: number
  totalProfitLoss: number
  totalProfitLossPercentage: number
  activeAssets: number
  allocation: AssetAllocation[]
  items: PortfolioItemWithValue[]
}
