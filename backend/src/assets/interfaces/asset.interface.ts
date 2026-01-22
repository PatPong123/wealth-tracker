export interface RawAsset {
  Symbol: string;
  Name: string;
  Description: string;
  'Current Price': string;
  Type: string;
  'Logo URL'?: string;
}

export interface StocksApiResponse {
  success: boolean;
  count?: number;
  data: RawAsset[];
}

export interface Asset {
  symbol: string;
  name: string;
  description: string;
  price: number;
  type: string;
  logo?: string | null;
}
