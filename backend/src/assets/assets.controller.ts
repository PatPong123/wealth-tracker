import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AssetsService } from './assets.service';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available assets' })
  @ApiResponse({ status: 200, description: 'List of all assets' })
  async findAll() {
    const assets = await this.assetsService.getAllAssets();
    return {
      success: true,
      count: assets.length,
      data: assets,
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search assets by symbol or name' })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query('q') query: string) {
    const assets = await this.assetsService.searchAssets(query);
    return {
      success: true,
      count: assets.length,
      data: assets,
    };
  }

  @Get('symbol/:symbol')
  @ApiOperation({ summary: 'Get asset by symbol' })
  @ApiResponse({ status: 200, description: 'Asset details' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findBySymbol(@Param('symbol') symbol: string) {
    const asset = await this.assetsService.getAssetBySymbol(symbol);
    return {
      success: !!asset,
      data: asset ? [asset] : [],
    };
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get assets by type' })
  @ApiResponse({ status: 200, description: 'List of assets by type' })
  async findByType(@Param('type') type: string) {
    const assets = await this.assetsService.getAssetsByType(type);
    return {
      success: true,
      count: assets.length,
      data: assets,
    };
  }
}
