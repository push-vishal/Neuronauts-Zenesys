from fastapi import APIRouter, status
from backend.schemas.procurement import ExpenseSubmissionSchema

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def submit_expense(expense: ExpenseSubmissionSchema):
    """
    Endpoint for employees to submit expenses, project cost allocations, 
    and track reimbursement status.
    """
    # For MVP hackathon scope, we return a structured success confirmation
    return {
        "status": "success",
        "message": "Expense submitted successfully and queued for finance review.",
        "data": expense.model_dump()
    }