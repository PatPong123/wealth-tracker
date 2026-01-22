import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('portfolio')
@Controller('portfolio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new asset to portfolio' })
  @ApiResponse({ status: 201, description: 'Asset added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createDto: CreatePortfolioItemDto,
  ) {
    return this.portfolioService.create(user.sub, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all portfolio items for current user' })
  @ApiResponse({ status: 200, description: 'Portfolio items retrieved' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.portfolioService.findAllByUser(user.sub);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get portfolio summary with total balance and P/L' })
  @ApiResponse({ status: 200, description: 'Portfolio summary retrieved' })
  getSummary(@CurrentUser() user: JwtPayload) {
    return this.portfolioService.getSummary(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific portfolio item' })
  @ApiResponse({ status: 200, description: 'Portfolio item retrieved' })
  @ApiResponse({ status: 404, description: 'Portfolio item not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.portfolioService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a portfolio item' })
  @ApiResponse({ status: 200, description: 'Portfolio item updated' })
  @ApiResponse({ status: 404, description: 'Portfolio item not found' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateDto: UpdatePortfolioItemDto,
  ) {
    return this.portfolioService.update(id, user.sub, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio item' })
  @ApiResponse({ status: 200, description: 'Portfolio item deleted' })
  @ApiResponse({ status: 404, description: 'Portfolio item not found' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.portfolioService.remove(id, user.sub);
  }
}
