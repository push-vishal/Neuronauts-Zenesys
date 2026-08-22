import os
from pathlib import Path
from functools import lru_cache

# Attempt to load .env file if python-dotenv is present
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

class Settings:
    APP_NAME: str = "FINOVA Intelligence Engine"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://dwcnkuazzjrqvcchkocr.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_XZgIKeNEgCEnMHGlM0DWNg_7W8WFOJz")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_STORAGE_BUCKET: str = os.getenv("SUPABASE_STORAGE_BUCKET", "invoices")
    
    # Gemini AI Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

@lru_cache()
def get_settings() -> Settings:
    return Settings()
