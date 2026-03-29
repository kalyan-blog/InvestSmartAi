from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import StockSummaryResponse, HistoricalStats, LiveStockData
from services import stocks_service, auth_service

router = APIRouter(prefix="/stocks", tags=["Stocks"])


@router.get("/summary", response_model=StockSummaryResponse)
async def get_stock_summary(
    symbol: str = Query("RELIANCE", min_length=1),
    current_user: models.User = Depends(auth_service.get_current_user)
):
    stats, closes, dates = stocks_service.calculate_historical_stats(symbol)
    live = stocks_service.fetch_live_price(symbol)
    return {
        "historical": stats,
        "live": live,
        "series": closes,
        "dates": dates,
    }


@router.get("/heatmap")
async def get_market_heatmap(current_user: models.User = Depends(auth_service.get_current_user)):
    return stocks_service.get_heatmap_data()


@router.get("/{symbol}")
async def get_stock(symbol: str):
    live = stocks_service.fetch_live_price(symbol)
    if live.get("last_price") is None:
        return {"error": "Market closed or invalid symbol"}
    return {"symbol": live.get("symbol"), "price": live.get("last_price")}
