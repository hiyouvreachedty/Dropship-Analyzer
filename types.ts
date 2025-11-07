
export interface SourcingOption {
  platform: 'AliExpress' | 'eBay' | 'Depop';
  title: string;
  price: number;
  imageUrl: string;
}

export interface PricingSuggestion {
  recommendedPrice: number;
  profitPerItem: number;
  reasoning: string;
}

export type AppState = 'idle' | 'identifying' | 'sourcing' | 'pricing' | 'results' | 'error';

export interface TrendingPrompt {
  prompt: string;
  icon: string;
}
