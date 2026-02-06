"""
Threat detection endpoints
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()


class Threat(BaseModel):
    id: str
    type: str
    severity: str
    source_ip: str
    target: str
    description: str
    detected_at: datetime
    status: str


@router.get("/", response_model=List[Threat])
async def get_threats():
    """Get all detected threats"""
    return [
        {
            "id": "threat-1",
            "type": "brute_force",
            "severity": "high",
            "source_ip": "192.168.1.100",
            "target": "ssh://server-01:22",
            "description": "Multiple failed SSH login attempts detected",
            "detected_at": datetime.now(),
            "status": "active",
        }
    ]


@router.get("/{threat_id}", response_model=Threat)
async def get_threat(threat_id: str):
    """Get specific threat"""
    return {
        "id": threat_id,
        "type": "port_scan",
        "severity": "medium",
        "source_ip": "10.0.0.50",
        "target": "192.168.1.0/24",
        "description": "Network port scanning activity detected",
        "detected_at": datetime.now(),
        "status": "mitigated",
    }
