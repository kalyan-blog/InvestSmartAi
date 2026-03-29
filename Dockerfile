# Backend image with baked CSV + SQLite + yfinance
FROM python:3.11-slim

# Optional: native build deps (helps yfinance/pandas). Remove if not needed.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Defaults (override with --env-file or -e)
ENV INVESTSMART_SECRET_KEY=change-me

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
