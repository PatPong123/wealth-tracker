import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetsService } from '../assets/assets.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { PortfolioSummary, PortfolioItemWithValue, PortfolioItem } from './interfaces/portfolio.interface';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assetsService: AssetsService,
  ) {}

  async create(userId: string, createDto: CreatePortfolioItemDto) {
    // Fetch asset info from external API to get the name
    const assetInfo = await this.assetsService.getAssetBySymbol(createDto.symbol);
    
    return this.prisma.portfolioItem.create({
      data: {
        userId,
        symbol: createDto.symbol?.toUpperCase(),
        name: assetInfo?.name || createDto.symbol,
        purchasePrice: createDto.purchasePrice,
        quantity: createDto.quantity,
        assetType: assetInfo?.type || null,
      },
    });
  }

  async findAllByUser(userId: string): Promise<PortfolioItemWithValue[]> {
    const items = await this.prisma.portfolioItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch current prices for all items
    const itemsWithValue = await Promise.all(
      items.map(async (item: PortfolioItem) => {
        const currentPrice = await this.assetsService.getCurrentPrice(item.symbol);
        const currentValue = currentPrice * item.quantity;
        const totalCost = item.purchasePrice * item.quantity;
        const profitLoss = currentValue - totalCost;
        const profitLossPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

        return {
          ...item,
          currentPrice,
          currentValue,
          totalCost,
          profitLoss,
          profitLossPercentage,
        };
      }),
    );

    return itemsWithValue;
  }

  async findOne(id: string, userId: string) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const currentPrice = await this.assetsService.getCurrentPrice(item.symbol);
    const currentValue = currentPrice * item.quantity;
    const totalCost = item.purchasePrice * item.quantity;
    const profitLoss = currentValue - totalCost;
    const profitLossPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

    return {
      ...item,
      currentPrice,
      currentValue,
      totalCost,
      profitLoss,
      profitLossPercentage,
    };
  }

  async update(id: string, userId: string, updateDto: UpdatePortfolioItemDto) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // If symbol is being updated, fetch new asset info
    let assetInfo = null;
    if (updateDto.symbol && updateDto.symbol !== item.symbol) {
      assetInfo = await this.assetsService.getAssetBySymbol(updateDto.symbol);
    }

    return this.prisma.portfolioItem.update({
      where: { id },
      data: {
        ...(updateDto.symbol && { symbol: updateDto.symbol?.toUpperCase() }),
        ...(assetInfo && { name: assetInfo.name, assetType: assetInfo.type }),
        ...(updateDto.purchasePrice !== undefined && {
          purchasePrice: updateDto.purchasePrice,
        }),
        ...(updateDto.quantity !== undefined && { quantity: updateDto.quantity }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Portfolio item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.portfolioItem.delete({
      where: { id },
    });
  }

  async getSummary(userId: string): Promise<PortfolioSummary> {
    const items = await this.findAllByUser(userId);

    const totalBalance = items.reduce((sum, item) => sum + item.currentValue, 0);
    const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
    const totalProfitLoss = totalBalance - totalCost;
    const totalProfitLossPercentage =
      totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    // Calculate asset allocation
    const allocation = items.map((item) => ({
      symbol: item.symbol,
      name: item.name,
      value: item.currentValue,
      percentage: totalBalance > 0 ? (item.currentValue / totalBalance) * 100 : 0,
    }));

    return {
      totalBalance,
      totalCost,
      totalProfitLoss,
      totalProfitLossPercentage,
      activeAssets: items.length,
      allocation,
      items,
    };
  }
}
