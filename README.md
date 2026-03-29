<<<<<<< HEAD
﻿# Project Name: Smart Market Tracker

## Overview
A highly optimized, full-stack stock market tracking application built with FastAPI and React.
Specially optimized to run smoothly without lagging even on lower-end hardware (e.g. i3 processors) by employing memory caching on the backend and lightweight DOM rendering components.

## Features
- **Market Heatmap**: Real-time visualization of top 30 Indian stocks' performance with 5-minute TTL server caching.
- **Market Directory**: Comprehensive list of 46 Indian equities categorized by sector.
- **User Dashboard**: Save and manage targeted stocks effortlessly.

## Architecture & Tech Stack
- **Frontend**: React, Vite build system, Tailwind CSS for strict layout rendering minimizing re-flows.
- **Backend**: FastAPI (Python), heavily cached yfinance logic, SQLAlchemy basic auth schema.

## Run the Project
### Start Backend
\\\ash
cd backend
venv\Scripts\activate
uvicorn main:app --port 8000
\\\`n
### Start Frontend
\\\ash
cd frontend
npm run build
npm run preview
\\\`n
=======
# InvestSmartAi
>>>>>>> d43249bc693c047b54c1377c3b6b327ca7bb071a
