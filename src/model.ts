import { AttributeValue } from "@aws-sdk/client-dynamodb";

export interface CreateStockTransactionRequest {
  readonly symbol: string;
  readonly value: number;
}

export interface StockTransaction {
  readonly symbol: string;
  readonly count: number;
  readonly createdAt: Date;
  readonly id: string;
}

export interface DdbStockRecord {
  purchaseCost: AttributeValue;
  createdAt: AttributeValue;
  count: AttributeValue;
  id: AttributeValue;
  symbol: AttributeValue;
}
