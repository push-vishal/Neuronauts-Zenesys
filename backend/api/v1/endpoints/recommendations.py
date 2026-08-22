from fastapi import APIRouter, status
from backend.services.supabase_service import SupabaseDatabaseService

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations"])

@router.get("/", status_code=status.HTTP_200_OK)
def get_recommendations():
    """
    Returns dynamically generated, evidence-based recommendations
    derived from active invoice price anomalies, 3-way match variances,
    and project budget overruns.
    """
    recs = SupabaseDatabaseService.get_recommendations()
    return {
        "status": "success",
        "count": len(recs),
        "recommendations": recs
    }
