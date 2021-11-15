import { InMemoryDb } from "./database";
import { v4 as uuidv4 } from "uuid";
import { CreateStockTransactionRequest, DdbStockRecord } from "./model";
import { getLatestStockPrice } from "./stockClient";
import { AWS_REGION, STOCK_API_KEY, TABLE_NAME } from "./constants";
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { ResponseMetadata } from "@aws-sdk/types";

export class StockService {
  private readonly db: InMemoryDb;
  private readonly ddbClient: DynamoDBClient;

  constructor() {
    this.db = new InMemoryDb();
    this.ddbClient = new DynamoDBClient({ region: AWS_REGION });
  }

  public async list() {
    try {
      const response = await this.ddbClient.send(
        new ScanCommand({ TableName: TABLE_NAME }),
      );

      if (!response.Items) {
        throw { httpStatusCode: 404, message: "no items were found" };
      }

      return response.Items.map((item) => {
        const { purchaseCost, createdAt, count, id, symbol } =
          item as unknown as DdbStockRecord;
        return {
          purchaseCost: purchaseCost.N,
          createdAt: createdAt.S,
          count: count.N,
          id: id.S,
          symbol: symbol.S,
        };
      });
    } catch (err: any) {
      if (err.httpStatusCode) {
        throw err;
      }
      if (!err.$metadata) {
        console.log("failed listing items", err);
      }
      const { $metadata, message } = err;
      const { requestId, cfId, extendedRequestId, httpStatusCode } =
        $metadata as ResponseMetadata;
      console.log({ requestId, cfId, extendedRequestId, message });
      throw { httpStatusCode, message };
    }
  }

  public async create({
    value,
    symbol,
  }: CreateStockTransactionRequest): Promise<{ status: number; id: string }> {
    try {
      const id = uuidv4();
      const stockPrice: number =
        value / +(await getLatestStockPrice(symbol, STOCK_API_KEY));
      const transaction = {
        id: { S: id },
        createdAt: { S: new Date().getDate().toString() },
        count: { N: stockPrice.toString() },
        symbol: { S: symbol },
        purchaseCost: { N: value.toString() },
      };
      await this.ddbClient.send(
        new PutItemCommand({ TableName: TABLE_NAME, Item: transaction }),
      );
      return { id, status: 200 };
    } catch (err: any) {
      if (err.metadata) {
        const { $metadata, message } = err;
        const { requestId, cfId, extendedRequestId, httpStatusCode } =
          $metadata as ResponseMetadata;
        console.log({ requestId, cfId, extendedRequestId, message });
        throw { httpStatusCode, message };
      }
      console.log("failed creating stock transaction", err);
      throw err;
    }
  }
}
