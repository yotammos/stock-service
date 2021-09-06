export interface CreateStockTransactionRequest {
  readonly symbol: string;
  readonly price: number;
  readonly count: number;
}

export interface StockTransaction {
  readonly symbol: string;
  readonly price: number;
  readonly count: number;
  readonly createdAt: Date;
  readonly id: string;
}