"""
Vulnerability endpoints
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()


class Vulnerability(BaseModel):
    id: str
    title: str
    severity: str
    cve_id: str
    affected_system: str
    description: str
    remediation: str
    discovered_at: datetime


@router.get("/", response_model=List[Vulnerability])
async def get_vulnerabilities():
    """Get all vulnerabilities"""
    return [
        {
            "id": "vuln-1",
            "title": "SQL Injection in Login Form",
            "severity": "critical",
            "cve_id": "CVE-2026-0001",
            "affected_system": "web-app-01",
            "description": "SQL injection vulnerability found in authentication endpoint",
            "remediation": "Use parameterized queries",
            "discovered_at": datetime.now(),
        }
    ]


@router.get("/{vuln_id}", response_model=Vulnerability)
async def get_vulnerability(vuln_id: str):
    """Get specific vulnerability"""
    return {
        "id": vuln_id,
        "title": "Cross-Site Scripting (XSS)",
        "severity": "high",
        "cve_id": "CVE-2026-0002",
        "affected_system": "web-app-02",
        "description": "Reflected XSS vulnerability in search parameter",
        "remediation": "Sanitize user input and implement CSP headers",
        "discovered_at": datetime.now(),
    }
