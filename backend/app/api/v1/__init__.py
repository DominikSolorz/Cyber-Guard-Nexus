"""
API v1 router
"""

from fastapi import APIRouter
from app.api.v1.endpoints import security, vulnerabilities, threats, monitoring

api_router = APIRouter()

api_router.include_router(
    security.router,
    prefix="/security",
    tags=["security"]
)

api_router.include_router(
    vulnerabilities.router,
    prefix="/vulnerabilities",
    tags=["vulnerabilities"]
)

api_router.include_router(
    threats.router,
    prefix="/threats",
    tags=["threats"]
)

api_router.include_router(
    monitoring.router,
    prefix="/monitoring",
    tags=["monitoring"]
)
