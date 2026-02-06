"""
Logging configuration
"""

import logging
import sys
from pathlib import Path


def setup_logging() -> logging.Logger:
    """Setup application logging"""
    
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(log_dir / "app.log"),
        ],
    )
    
    logger = logging.getLogger("cyber_guard_nexus")
    return logger
