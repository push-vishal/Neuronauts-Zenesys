from fastapi import APIRouter, status
from backend.schemas.procurement import ExpenseSubmissionSchema
from backend.services.supabase_service import SupabaseDatabaseService

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def submit_expense(expense: ExpenseSubmissionSchema):
    """
    Endpoint for employees to submit expenses, project cost allocations, 
    and store record in Supabase DB.
    """
    expense_dict = expense.model_dump()
    
    # Save to Supabase Database
    saved_record = SupabaseDatabaseService.save_expense(expense_dict)

    return {
        "status": "success",
        "message": "Expense submitted successfully and saved in Supabase database.",
        "data": saved_record
    }