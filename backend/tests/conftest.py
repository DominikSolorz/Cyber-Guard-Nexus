"""
Test configuration and fixtures
"""

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Test client fixture"""
    return TestClient(app)


@pytest.fixture
def sample_data():
    """Sample test data"""
    return {
        "scan": {
            "target": "example.com",
            "scan_type": "web",
        },
        "vulnerability": {
            "title": "Test Vulnerability",
            "severity": "high",
        },
    }
