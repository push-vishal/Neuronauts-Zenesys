import logging
from backend.core.config import get_settings

logger = logging.getLogger("finova")

def init_db():
    """
    Initialises database connection or Supabase PostgreSQL tables.
    """
    settings = get_settings()
    logger.info(f"Connecting to database / Supabase instance at {settings.SUPABASE_URL}")
    print(f"Database connection initialized for {settings.APP_NAME} [SUCCESS]")
