import axios from "axios";

const BASE_URL =
  "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY";

interface Metadata {
  readonly "1. Information": string;
  readonly "2. Symbol": string;
  readonly "3. Last Refreshed": string;
  readonly "4. Interval": string;
  readonly "5. Output Size": string;
  readonly "6. Time Zone": string;
}

interface StockSession {
  readonly "1. open": string;
  readonly "2. high": string;
  readonly "3. low": string;
  readonly "4. close": string;
  readonly "5. volume": string;
}

interface StockPriceResponse {
  readonly ["Meta Data"]: Metadata;
  readonly ["Time Series (5min)"]: Record<string, StockSession>;
}

export async function getLatestStockPrice(
  symbol: string,
  apiKey = process.env.ALPHA_VENTAGE_API_KEY,
) {
  const response = await axios.get(
    `${BASE_URL}&symbol=${symbol}&interval=5min&apikey=${apiKey}`,
  );
  const data: StockPriceResponse = response.data;
  if (data && data["Meta Data"] && data["Meta Data"]["3. Last Refreshed"]) {
    const lastRefreshed = data["Meta Data"]["3. Last Refreshed"];
    return data["Time Series (5min)"][lastRefreshed]["4. close"];
  }
  throw new Error("failed getting stock data for " + symbol);
}
