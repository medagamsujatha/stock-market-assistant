import type { Express } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { storage } from "./storage";
import { getStockQuote, analyzeStock, getOptionsData } from "./stocks";

export function setupMcpServer(app: Express) {
  const mcpServer = new McpServer({
    name: "IndiaQuant MCP",
    version: "1.0.0",
  });

  // Tool 1: Get portfolio P&L / Positions
  mcpServer.tool(
    "get_portfolio",
    "Get the user's current portfolio positions including stocks and options.",
    {},
    async () => {
      try {
        const positions = await storage.getPositions();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(positions, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to get portfolio: " + err,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool 2: Stock price / Quote (Real-time data from Yahoo Finance)
  mcpServer.tool(
    "get_stock_quote",
    "Get real-time price and technical indicators (RSI, MACD) for any stock symbol using Yahoo Finance.",
    { symbol: z.string().describe("Stock symbol (e.g. RELIANCE.NS, HDFCBANK.NS for NSE, INFY for INFY)") },
    async ({ symbol }) => {
      try {
        const analysis = await analyzeStock(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(analysis, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool 3: Options Greeks & Unusual Activity
  mcpServer.tool(
    "analyze_options",
    "Calculate Greeks (Delta, Gamma, Theta, Vega) and detect unusual options activity for a stock/index with real underlying prices.",
    { symbol: z.string().describe("Underlying symbol (e.g. NIFTY, INFOSYS.NS)") },
    async ({ symbol }) => {
      try {
        const optionsData = await getOptionsData(symbol);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(optionsData, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  let transport: SSEServerTransport | null = null;

  app.get("/sse", async (req, res) => {
    console.log("New SSE connection established");
    transport = new SSEServerTransport("/messages", res);
    await mcpServer.connect(transport);
  });

  app.post("/messages", async (req, res) => {
    if (!transport) {
      res.status(400).send("No active SSE connection");
      return;
    }
    try {
      await transport.handlePostMessage(req, res);
    } catch (err) {
      console.error("Error handling POST message:", err);
      res.status(500).send("Internal Error");
    }
  });
}