from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes import auth, profile, stocks

Base.metadata.create_all(bind=engine)

app = FastAPI(title="InvestSmart AI – Indian Stock Market Intelligence Platform", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(stocks.router)

@app.get("/")
def health():
    return {"status": "ok", "message": "InvestSmart API running"}
