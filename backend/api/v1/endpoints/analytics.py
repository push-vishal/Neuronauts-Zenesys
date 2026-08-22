from fastapi import APIRouter, status
from backend.services.supabase_service import SupabaseDatabaseService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/", status_code=status.HTTP_200_OK)
def get_analytics():
    """
    Returns live dynamic analytics, category spend breakdown,
    monthly trends, and organization-wide procurement KPIs.
    """
    return SupabaseDatabaseService.get_analytics_summary()
