from typing import Optional
from pydantic import BaseModel

class PurchaseOrderSchema(BaseModel):
    po_number: str
    vendor_name: str
    total_amount: float
    status: str = "issued"

class GoodsReceivedNoteSchema(BaseModel):
    grn_number: str
    po_number: str
    received_items_summary: str
    status: str = "verified"

class ExpenseSubmissionSchema(BaseModel):
    employee_name: str
    project_name: str
    amount: float
    category: str
    receipt_url: Optional[str] = None