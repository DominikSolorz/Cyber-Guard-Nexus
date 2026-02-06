"""
Tests for security endpoints
"""

import pytest


def test_get_security_scans(client):
    """Test getting security scans"""
    response = client.get("/api/v1/security/scans")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_security_scan(client, sample_data):
    """Test creating a security scan"""
    response = client.post(
        "/api/v1/security/scans",
        json=sample_data["scan"]
    )
    assert response.status_code == 200
    data = response.json()
    assert data["target"] == sample_data["scan"]["target"]
    assert data["scan_type"] == sample_data["scan"]["scan_type"]
