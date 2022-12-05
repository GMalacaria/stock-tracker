export interface SymbolLookup {
  count: number;
  result: SymbolLookupResult[];
}

export interface SymbolLookupResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface Stock {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
  quote: Quote;
}

export interface Quote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
}

export interface InsiderSentiment {
  data: DataInsiderSentiment[];
  symbol: string;
}
export interface DataInsiderSentiment {
  symbol: string;
  year: number;
  month: number;
  change: number;
  mspr: number;
}
