from fastapi import APIRouter, status
from backend.services.supabase_service import SupabaseDatabaseService

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("/", status_code=status.HTTP_200_OK)
def get_project_costs():
    """
    Returns project list with budget vs. actual spend metrics, 
    supporting Project Manager & CFO role dashboards.
    """
    projects = SupabaseDatabaseService.get_projects()
    
    total_budget = sum(p.get("budget_amount", 0) for p in projects)
    total_spend = sum(p.get("actual_spend", 0) for p in projects)
    overbudget_count = sum(1 for p in projects if p.get("actual_spend", 0) > p.get("budget_amount", 0))

    return {
        "status": "success",
        "total_budget": total_budget,
        "total_spend": total_spend,
        "overbudget_projects_count": overbudget_count,
        "projects": projects
    }
