import yahooFinance from "yahoo-finance2";

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

export interface StockAnalysis {
  symbol: string;
  price: number;
  rsi?: number;
  macd?: {
    value: number;
    signal: number;
    histogram: number;
  };
  status: "Oversold" | "Overbought" | "Neutral";
  recommendation: "Buy" | "Hold" | "Sell";
}

// Cache to avoid excessive API calls (cache for 5 minutes)
const quoteCache = new Map<string, { data: StockQuote; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const cached = quoteCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const quote = await yahooFinance.quote(symbol, {
      fields: ["regularMarketPrice", "regularMarketChange", "regularMarketChangePercent"],
    });

    const data: StockQuote = {
      symbol: quote.symbol || symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      timestamp: new Date(),
    };

    quoteCache.set(symbol, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.error(`Failed to fetch quote for ${symbol}:`, err);
    throw new Error(`Unable to fetch stock data for ${symbol}`);
  }
}

export async function analyzeStock(symbol: string): Promise<StockAnalysis> {
  try {
    const quote = await getStockQuote(symbol);

    // Simple RSI approximation based on price change
    // In a real system, this would use historical data
    const rsi = calculateRSI(quote.changePercent);

    // Simple MACD approximation
    const macd = {
      value: quote.changePercent * 0.5,
      signal: quote.changePercent * 0.3,
      histogram: quote.changePercent * 0.2,
    };

    // Determine status and recommendation based on RSI
    let status: "Oversold" | "Overbought" | "Neutral" = "Neutral";
    let recommendation: "Buy" | "Hold" | "Sell" = "Hold";

    if (rsi < 30) {
      status = "Oversold";
      recommendation = "Buy";
    } else if (rsi > 70) {
      status = "Overbought";
      recommendation = "Sell";
    } else {
      status = "Neutral";
      recommendation = quote.changePercent > 0 ? "Buy" : "Sell";
    }

    return {
      symbol: quote.symbol,
      price: quote.price,
      rsi,
      macd,
      status,
      recommendation,
    };
  } catch (err) {
    console.error(`Failed to analyze stock ${symbol}:`, err);
    throw new Error(`Unable to analyze ${symbol}`);
  }
}

function calculateRSI(changePercent: number): number {
  // Simplified RSI calculation for demo
  // Real RSI would need 14 periods of data
  return 50 + Math.min(Math.max(changePercent * 2, -20), 20);
}

export async function getOptionsData(
  symbol: string
) {
  try {
    const quote = await getStockQuote(symbol);

    // Mock options data with real underlying price
    return {
      symbol: quote.symbol,
      underlyingPrice: quote.price,
      maxPainStrike: Math.floor((quote.price / 50) * 50), // Round to nearest 50
      unusualActivity: Math.random() > 0.7,
      notableStrikes: [
        {
          strike: Math.floor((quote.price / 50) * 50),
          type: "CE" as const,
          impliedVolatility: (15 + Math.random() * 30).toFixed(2) + "%",
          greeks: {
            delta: (Math.random()).toFixed(2),
            gamma: (Math.random() * 0.1).toFixed(4),
            theta: -(Math.random() * 5).toFixed(2),
            vega: (Math.random() * 10).toFixed(2),
          },
          volumeSpike: Math.random() > 0.5 ? "300% over average" : "Normal",
        },
      ],
    };
  } catch (err) {
    console.error(`Failed to get options data for ${symbol}:`, err);
    throw new Error(`Unable to get options data for ${symbol}`);
  }
}
