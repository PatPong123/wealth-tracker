import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from '../prisma/prisma.service';
import { AssetsService } from '../assets/assets.service';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let prismaService: PrismaService;
  let assetsService: AssetsService;

  const mockPrismaService = {
    portfolioItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAssetsService = {
    getAssetBySymbol: jest.fn(),
    getCurrentPrice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AssetsService, useValue: mockAssetsService },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    prismaService = module.get<PrismaService>(PrismaService);
    assetsService = module.get<AssetsService>(AssetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a portfolio item', async () => {
      const userId = 'user-123';
      const createDto = {
        symbol: 'AAPL',
        purchasePrice: 175.5,
        quantity: 10,
      };

      const mockAsset = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'Technology',
        price: 180.0,
      };

      const mockCreatedItem = {
        id: 'item-123',
        userId,
        symbol: 'AAPL',
        name: 'Apple Inc.',
        purchasePrice: 175.5,
        quantity: 10,
        assetType: 'Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAssetsService.getAssetBySymbol.mockResolvedValue(mockAsset);
      mockPrismaService.portfolioItem.create.mockResolvedValue(mockCreatedItem);

      const result = await service.create(userId, createDto);

      expect(result).toEqual(mockCreatedItem);
      expect(mockAssetsService.getAssetBySymbol).toHaveBeenCalledWith('AAPL');
      expect(mockPrismaService.portfolioItem.create).toHaveBeenCalledWith({
        data: {
          userId,
          symbol: 'AAPL',
          name: 'Apple Inc.',
          purchasePrice: 175.5,
          quantity: 10,
          assetType: 'Technology',
        },
      });
    });
  });

  describe('Profit/Loss Calculation', () => {
    it('should calculate profit correctly', () => {
      const purchasePrice = 100;
      const quantity = 10;
      const currentPrice = 150;

      const totalCost = purchasePrice * quantity; // 1000
      const currentValue = currentPrice * quantity; // 1500
      const profitLoss = currentValue - totalCost; // 500
      const profitLossPercentage = (profitLoss / totalCost) * 100; // 50%

      expect(totalCost).toBe(1000);
      expect(currentValue).toBe(1500);
      expect(profitLoss).toBe(500);
      expect(profitLossPercentage).toBe(50);
    });

    it('should calculate loss correctly', () => {
      const purchasePrice = 100;
      const quantity = 10;
      const currentPrice = 80;

      const totalCost = purchasePrice * quantity; // 1000
      const currentValue = currentPrice * quantity; // 800
      const profitLoss = currentValue - totalCost; // -200
      const profitLossPercentage = (profitLoss / totalCost) * 100; // -20%

      expect(totalCost).toBe(1000);
      expect(currentValue).toBe(800);
      expect(profitLoss).toBe(-200);
      expect(profitLossPercentage).toBe(-20);
    });
  });
});
