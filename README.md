# stock-market-assistant
IndiaQuant MCP is a real-time Indian stock market AI assistant built using Express.js, PostgreSQL, and the Model Context Protocol. It provides live stock quotes, technical indicators (RSI, MACD), portfolio tracking, and options analysis with Greeks. The MCP server integrates with Claude to deliver intelligent trading insights.


Project Description:Developed IndiaQuant MCP, a real-time AI-powered Indian stock market assistant using Python and Model Context Protocol (MCP). The system integrates free APIs such as Yahoo Finance, NewsAPI, and Alpha Vantage to fetch live market data, perform technical analysis (RSI, MACD, Bollinger Bands), generate BUY/SELL/HOLD trading signals, analyze options chains with Black-Scholes Greeks calculation, and manage a virtual trading portfolio with real-time P&L and risk analysis. It exposes 10 MCP tools that enable AI agents to access live stock intelligence and market insights through natural language queries

```Project Structure:
indiaquant-mcp/
│
├── app.py
├── mcp_server.py
├── config.py
├── requirements.txt
├── README.md
│
├── data/
│   ├── market_data.py
│   ├── options_data.py
│   └── news_data.py
│
├── analysis/
│   ├── technical_indicators.py
│   ├── signal_generator.py
│   ├── sentiment_analysis.py
│   └── options_analysis.py
│
├── portfolio/
│   ├── portfolio_manager.py
│   ├── risk_manager.py
│   └── database.py
│
├── mcp_tools/
│   ├── price_tools.py
│   ├── options_tools.py
│   ├── signal_tools.py
│   ├── portfolio_tools.py
│   └── market_scan_tools.py
│
├── utils/
│   ├── helpers.py
│   ├── cache.py
│   └── constants.py
│
└── tests/
    ├── test_market_data.py
    ├── test_signals.py
    └── test_portfolio.py```


Project Advantages:
1.Real-Time Market Insights
The system provides real-time stock prices, options data, and market trends using free APIs like Yahoo Finance, helping users make informed trading decisions.

2.AI-Powered Trading Assistance
By integrating with AI agents through MCP tools, the system allows users to ask natural language questions such as stock recommendations, portfolio performance, or market trends.

3.Advanced Technical Analysis
The project calculates technical indicators such as RSI, MACD, and Bollinger Bands to generate BUY, SELL, or HOLD signals with confidence scores.

4.Options Market Analysis
Implements the Black-Scholes model to calculate option Greeks (Delta, Gamma, Theta, Vega) and analyze options chain data for better derivatives trading insights.

5.Sentiment-Based Decision Making
Analyzes financial news using sentiment analysis to understand market mood and incorporate it into trading signals.

Project Benifits:
1.Better Investment Decisions
The system provides real-time market data and technical indicators, helping users make more informed buy or sell decisions.

2.Time Saving
Automatically analyzes stock data, options chains, and market trends, reducing the time traders spend on manual research.

3.AI-Based Market Assistance
Users can interact with the system through natural language queries and quickly receive stock insights, signals, and portfolio updates.

4.Risk Management
Helps users monitor portfolio performance, calculate real-time profit and loss (P&L), and manage risk using stop-loss and volatility analysis.

5.Learning Platform for Traders
The virtual portfolio allows beginners to practice trading strategies without investing real money.
