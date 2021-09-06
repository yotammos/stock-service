import { InMemoryDb } from "./database";
import { v4 as uuidv4 } from "uuid"; 
import { CreateStockTransactionRequest } from "./model";


export class StockService {
  private readonly db: InMemoryDb;

  constructor() {
    this.db = new InMemoryDb();
  }

  list() {
    return this.db.list();
  }

  create(request: CreateStockTransactionRequest) {
    const id = uuidv4();
    const transaction = {
      id,
      createdAt: new Date(),
      ...request
    };
    this.db.create(transaction);
    return id;
  }
}