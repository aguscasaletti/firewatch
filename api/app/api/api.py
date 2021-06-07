from fastapi import APIRouter

from app.features.alerts.router import router as main_router
from app.features.health.router import router as health_router

api_router = APIRouter()
api_router.include_router(main_router, tags=["main"])
api_router.include_router(health_router, prefix="/health", tags=["health"])
