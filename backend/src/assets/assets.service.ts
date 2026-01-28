import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Asset, RawAsset, StocksApiResponse } from './interfaces/asset.interface';
import axios from 'axios';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);
  private readonly apiUrl: string;
  private assetsCache: Map<string, Asset> = new Map();
  private lastCacheUpdate: Date | null = null;
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl =
      this.configService.get<string>('STOCKS_API_URL') ||
      'https://woxa-stocks-test-data.yuttanar.workers.dev';
  }

  private isCacheValid(): boolean {
    if (!this.lastCacheUpdate) return false;
    return Date.now() - this.lastCacheUpdate.getTime() < this.cacheDuration;
  }

  async getAllAssets(): Promise<Asset[]> {
    try {
      // 1️⃣ Return cache if valid
      if (this.isCacheValid() && this.assetsCache.size > 0) {
        return Array.from(this.assetsCache.values());
      }

      // 2️⃣ Fetch API
      const res = await axios.get<StocksApiResponse>(this.apiUrl);
      const rawAssets: RawAsset[] = res.data.data || [];

      // 3️⃣ Convert Raw → Asset
      const assets: Asset[] = rawAssets.map((a) => ({
        symbol: a.Symbol,
        name: a.Name,
        description: a.Description,
        price: Number(a['Current Price']),
        type: a.Type,
        logo: a['Logo URL'],
      }));

      // 4️⃣ Update cache (ONLY Asset)
      this.assetsCache.clear();
      assets.forEach((a) => {
        this.assetsCache.set(a.symbol.toUpperCase(), a);
      });
      this.lastCacheUpdate = new Date();

      return assets;
    } catch (error) {
      this.logger.error('Failed to fetch assets from external API', error);

      // fallback to cache
      if (this.assetsCache.size > 0) {
        return Array.from(this.assetsCache.values());
      }
      return [];
    }
  }
async getAssetBySymbol(symbol: string): Promise<Asset | null> {
  const upper = symbol.toUpperCase();

  // ✅ ensure cache is ready
  if (!this.isCacheValid() || this.assetsCache.size === 0) {
    await this.getAllAssets();
  }

  return this.assetsCache.get(upper) || null;
}

    async getCurrentPrice(symbol: string): Promise<number> {
    const asset = await this.getAssetBySymbol(symbol);
    return asset?.price || 0;
  }
  async getAssetsByType(type: string): Promise<Asset[]> {
    try {
      const res = await axios.get<StocksApiResponse>(
        `${this.apiUrl}/type/${type}`,
      );

      const rawAssets = res.data.data || [];

      return rawAssets.map((a) => ({
        symbol: a.Symbol,
        name: a.Name,
        description: a.Description,
        price: Number(a['Current Price']),
        type: a.Type,
        logo: a['Logo URL'],
      }));
    } catch (e) {
      this.logger.error(`Failed to fetch assets by type ${type}`, e);
      return [];
    }
  }
   async searchAssets(query: string): Promise<Asset[]> {
  const allAssets = await this.getAllAssets();

  // 🔥 ถ้าไม่ได้พิมพ์อะไร → ส่งทั้งหมด
  if (!query || query.trim() === '') {
    return allAssets.slice(0, 20); // กัน list ใหญ่เกิน
  }

  const lower = query.toLowerCase();

  return allAssets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(lower) ||
      asset.name.toLowerCase().includes(lower),
  );
}
}


