"""
Real-time monitoring endpoints
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List
from datetime import datetime

router = APIRouter()


class SystemMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    network_traffic: Dict[str, float]
    active_connections: int
    timestamp: datetime


class SecurityEvent(BaseModel):
    id: str
    event_type: str
    severity: str
    message: str
    timestamp: datetime


@router.get("/metrics", response_model=SystemMetrics)
async def get_system_metrics():
    """Get current system metrics"""
    return {
        "cpu_usage": 45.2,
        "memory_usage": 62.8,
        "network_traffic": {
            "incoming": 1024.5,
            "outgoing": 512.3,
        },
        "active_connections": 127,
        "timestamp": datetime.now(),
    }


@router.get("/events", response_model=List[SecurityEvent])
async def get_security_events():
    """Get recent security events"""
    return [
        {
            "id": "event-1",
            "event_type": "authentication",
            "severity": "info",
            "message": "User login successful from 192.168.1.50",
            "timestamp": datetime.now(),
        },
        {
            "id": "event-2",
            "event_type": "firewall",
            "severity": "warning",
            "message": "Blocked connection attempt from suspicious IP",
            "timestamp": datetime.now(),
        },
    ]
