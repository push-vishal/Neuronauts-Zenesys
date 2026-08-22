from fastapi import APIRouter, status
from backend.schemas.procurement import PurchaseOrderSchema
from backend.services.supabase_service import SupabaseDatabaseService

router = APIRouter(prefix="/procurement", tags=["Procurement"])

@router.get("/pos", status_code=status.HTTP_200_OK)
def list_purchase_orders():
    """
    Returns list of issued and fulfilled Purchase Orders (POs) 
    for Procurement Manager & Vendor roles.
    """
    pos = SupabaseDatabaseService.get_purchase_orders()
    return {
        "status": "success",
        "count": len(pos),
        "purchase_orders": pos
    }

@router.post("/pos", status_code=status.HTTP_201_CREATED)
def create_purchase_order(po: PurchaseOrderSchema):
    """
    Creates a new Purchase Order for vendors.
    """
    po_dict = po.model_dump()
    saved_po = SupabaseDatabaseService.create_purchase_order(po_dict)
    return {
        "status": "success",
        "message": f"Purchase Order {po.po_number} created successfully.",
        "data": saved_po
    }
