import os
import time
from datetime import datetime
from statistics import mean, pstdev
from typing import List, Tuple
from dotenv import load_dotenv

import yfinance as yf

load_dotenv()

def get_symbol_mapping(symbol: str) -> str:
    # Map common Indian tickers to Yahoo Finance symbols
    sym_upper = symbol.upper()
    if sym_upper.endswith(".NS") or sym_upper.endswith(".BO"):
        return sym_upper
        
    mapping = {
        "RELIANCE": "RELIANCE.NS",
        "TCS": "TCS.NS",
        "INFY": "INFY.NS",
        "HDFCBANK": "HDFCBANK.NS",
    }
    return mapping.get(sym_upper, f"{sym_upper}.NS")


def calculate_historical_stats(symbol: str) -> Tuple[dict, List[float], List[str]]:
    yf_symbol = get_symbol_mapping(symbol)
    ticker = yf.Ticker(yf_symbol)
    
    try:
        print(f"Fetching 3mo history for {yf_symbol}...")
        # Fetch 3 months of history for stats
        hist = ticker.history(period="3mo")
        if hist.empty:
            print(f"No history data returned for {yf_symbol}")
            return {"symbol": symbol.upper(), "average_price": 0.0, "volatility": 0.0, "trend": "Unknown", "alerts": []}, [], []
        
        import math
        closes_raw = hist["Close"].tolist()
        dates_raw = hist.index
        
        closes = []
        dates = []
        for x, d in zip(closes_raw, dates_raw):
            if not math.isnan(x):
                closes.append(float(x))
                dates.append(d.strftime("%Y-%m-%d"))
        
        avg_price = mean(closes) if closes else 0.0
        volatility = pstdev(closes) if len(closes) > 1 else 0.0

        trend = "Uptrend" if closes and closes[-1] >= closes[0] else "Downtrend"
        alerts = []
        if trend == "Uptrend":
            alerts.append("Uptrend detected")
        if volatility > avg_price * 0.05:
            alerts.append("High volatility")

        stats = {
            "symbol": symbol.upper(),
            "average_price": round(avg_price, 2),
            "volatility": round(volatility, 2),
            "trend": trend,
            "alerts": alerts,
        }
        return stats, closes, dates
    except Exception:
        return {"symbol": symbol.upper(), "average_price": 0.0, "volatility": 0.0, "trend": "Unknown", "alerts": []}, [], []


def fetch_live_price(symbol: str) -> dict:
    yf_symbol = get_symbol_mapping(symbol)
    ticker = yf.Ticker(yf_symbol)
    try:
        print(f"Fetching live price for {yf_symbol}...")
        info = ticker.history(period="5d")
        if info.empty:
            print(f"No live price data returned for {yf_symbol}")
            return {"symbol": symbol.upper(), "last_price": None, "change_percent": None}
        last_price = float(info["Close"].iloc[-1])
        if len(info) > 1:
            prev_close = float(info["Close"].iloc[-2])
            change_percent = round(((last_price - prev_close) / prev_close) * 100, 2)
        else:
            change_percent = None
        return {
            "symbol": symbol.upper(),
            "last_price": round(last_price, 2),
            "change_percent": change_percent,
        }
    except Exception:
        return {"symbol": symbol.upper(), "last_price": None, "change_percent": None}

# Global cache to speed up heatmap loading
_heatmap_cache = {
    "data": [],
    "last_updated": 0
}
CACHE_TTL = 300  # 5 minutes caching

def get_heatmap_data() -> List[dict]:
    global _heatmap_cache
    current_time = time.time()
    
    # Return instantly if cache is still fresh!
    if _heatmap_cache["data"] and (current_time - _heatmap_cache["last_updated"] < CACHE_TTL):
        return _heatmap_cache["data"]

    symbols = [
        'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK',
        'KOTAKBANK', 'BAJFINANCE', 'BAJAJFINSV', 'WIPRO', 'HCLTECH', 'TECHM',
        'LTIM', 'MPHASIS', 'HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA',
        'DABUR', 'ONGC', 'BPCL', 'IOC', 'ADANIGREEN', 'ADANIPORTS', 'TATAMOTORS',
        'MARUTI', 'M&M', 'HEROMOTOCO', 'EICHERMOT'
    ]
    yf_symbols = [get_symbol_mapping(s) for s in symbols]
    
    try:
        data = yf.download(yf_symbols, period="2d", group_by="ticker", progress=False)
        heatmap = []
        for i, sym in enumerate(symbols):
            yf_sym = yf_symbols[i]
            # Handle pandas DataFrame typing constraints
            try:
                # Force dynamic lookup to bypass static type-checkers thinking dataframe is None
                columns_list = getattr(data, 'columns', [])
                if hasattr(columns_list, '__contains__') and yf_sym in columns_list:
                    ticker_data = data[yf_sym] # type: ignore
                    if hasattr(ticker_data, 'empty') and not getattr(ticker_data, 'empty'): # type: ignore
                        current_price = ticker_data['Close'].iloc[-1] # type: ignore
                        prev_price = ticker_data['Close'].iloc[-2] # type: ignore
                        
                        import math
                        if not math.isnan(current_price) and not math.isnan(prev_price):
                            change = ((current_price - prev_price) / prev_price) * 100
                            heatmap.append({
                                "symbol": sym,
                                "price": round(float(current_price), 2),
                                "change_percent": round(float(change), 2)
                            })
                            continue
            except Exception:
                pass
            
            # Fallback for missing/bad data
            heatmap.append({
                "symbol": sym,
                "price": 0.0,
                "change_percent": 0.0
            })
            
        # Save to memory cache before returning
        _heatmap_cache["data"] = heatmap
        _heatmap_cache["last_updated"] = time.time()
        return heatmap
    except Exception as e:
        print(f"Heatmap error: {e}")
        return []
