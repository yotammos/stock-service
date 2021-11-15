import { StockTransaction } from "./model";

export class InMemoryDb {
  readonly #transactions: Array<StockTransaction>;

  constructor() {
    this.#transactions = [];
  }

  list() {
    return this.#transactions;
  }

  create(transaction: StockTransaction) {
    this.#transactions.push(transaction);
  }
}
