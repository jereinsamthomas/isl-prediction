"""
backend/main.py
===============
ISL Football Intelligence API Server
FastAPI entrypoint with high-performance caching and full route registration.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.data_loader import data_loader
from backend.services.prediction_service import prediction_service

from backend.routes.prediction import router as prediction_router
from backend.routes.teams import router as teams_router
from backend.routes.players import router as players_router
from backend.routes.matches import router as matches_router
from backend.routes.analytics import router as analytics_router
from backend.routes.models import router as models_router
from backend.routes.dataset import router as dataset_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure dataset and models are ready
    print("=" * 60)
    print("ISL Football Intelligence API Backend Starting...")
    print(f"  Loaded {len(data_loader.matches_df)} matches across {len(data_loader.teams)} teams.")
    print(f"  ML Models loaded: {list(prediction_service.models.keys())}")
    print("  Server is READY on http://127.0.0.1:8000")
    print("=" * 60)
    yield
    print("ISL Football Intelligence API Backend Shutting Down...")

app = FastAPI(
    title="ISL Football Intelligence API",
    description="Machine Learning Match Prediction & Performance Analytics for Indian Super League",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend (Vite default is 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(prediction_router, prefix="/api")
app.include_router(teams_router, prefix="/api")
app.include_router(players_router, prefix="/api")
app.include_router(matches_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(models_router, prefix="/api")
app.include_router(dataset_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ISL Football Intelligence API",
        "dataset_matches": len(data_loader.matches_df),
        "teams_count": len(data_loader.teams),
        "models_count": len(prediction_service.models)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
