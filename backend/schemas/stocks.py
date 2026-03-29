from typing import List, Optional
from pydantic import BaseModel


class HistoricalStats(BaseModel):
    symbol: str
    average_price: float
    volatility: float
    trend: str
    alerts: List[str]


class LiveStockData(BaseModel):
    symbol: str
    last_price: Optional[float]
    change_percent: Optional[float]


class StockSummaryResponse(BaseModel):
    historical: HistoricalStats
    live: LiveStockData
    series: List[float]
    dates: List[str]
