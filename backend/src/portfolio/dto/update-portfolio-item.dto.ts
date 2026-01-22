import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdatePortfolioItemDto {
  @ApiPropertyOptional({
    description: 'Asset symbol (e.g., AAPL, BTC)',
    example: 'AAPL',
    minLength: 1,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Symbol is required' })
  @MaxLength(10, { message: 'Symbol must not exceed 10 characters' })
  symbol?: string;

  @ApiPropertyOptional({
    description: 'Purchase price per unit',
    example: 175.5,
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Purchase price must be a number' })
  @IsPositive({ message: 'Purchase price must be positive' })
  purchasePrice?: number;

  @ApiPropertyOptional({
    description: 'Quantity of units held',
    example: 10,
    minimum: 0.0001,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be positive' })
  quantity?: number;
}
