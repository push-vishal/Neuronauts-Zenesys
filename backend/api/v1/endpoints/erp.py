from typing import Optional
from fastapi import APIRouter, status
from pydantic import BaseModel
from backend.services.erp_service import ErpService

router = APIRouter(prefix="/erp", tags=["ERP & NetSuite Integration"])

class JournalEntryRequest(BaseModel):
    invoice_ref: str
    vendor_name: str
    amount: float
    category: Optional[str] = "Software"

@router.get("/netsuite/status", status_code=status.HTTP_200_OK)
def get_netsuite_status():
    """
    Returns Oracle NetSuite SuiteTalk REST Web Services connection health,
    realm, subsidiary, and supported record sync types.
    """
    return ErpService.get_netsuite_status()

@router.post("/netsuite/sync", status_code=status.HTTP_200_OK)
def sync_netsuite():
    """
    Triggers 2-way synchronization of VendorBills, PurchaseOrders, ItemReceipts,
    and ExpenseReports with Oracle NetSuite ERP.
    """
    return ErpService.sync_netsuite_records()

@router.post("/netsuite/post-journal", status_code=status.HTTP_201_CREATED)
def post_journal_entry(req: JournalEntryRequest):
    """
    Generates and posts a double-entry balanced General Ledger (GL) Journal Entry
    to Oracle NetSuite with Department, Class, and Location dimensions.
    """
    journal = ErpService.generate_gl_journal_entry(
        invoice_ref=req.invoice_ref,
        vendor_name=req.vendor_name,
        amount=req.amount,
        category=req.category or "Software"
    )
    return {
        "status": "success",
        "message": f"Journal Entry {journal['journal_id']} generated and posted to Oracle NetSuite GL.",
        "journal": journal
    }

@router.get("/gl-accounts", status_code=status.HTTP_200_OK)
def get_chart_of_accounts():
    """
    Returns NetSuite Chart of Accounts with department budget, actual spend, and encumbrances.
    """
    return {
        "status": "success",
        "chart_of_accounts": ErpService.CHART_OF_ACCOUNTS
    }

@router.get("/commitments", status_code=status.HTTP_200_OK)
def get_budgetary_commitments():
    """
    Returns real-time ERP budgetary encumbrance and commitment analytics.
    """
    return ErpService.get_commitments_and_encumbrances()
