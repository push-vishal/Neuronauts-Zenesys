import logging
from typing import Dict, Any, List, Optional
from supabase import create_client, Client
from backend.core.config import get_settings

logger = logging.getLogger("finova.supabase")

class SupabaseDatabaseService:
    _client: Optional[Client] = None

    @classmethod
    def get_client(cls) -> Optional[Client]:
        if cls._client:
            return cls._client

        settings = get_settings()
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_KEY

        if not url or not key:
            logger.warning("Supabase URL or Key not fully configured.")
            return None

        try:
            cls._client = create_client(url, key)
            return cls._client
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            return None

    @classmethod
    def get_projects(cls) -> List[Dict[str, Any]]:
        client = cls.get_client()
        if client:
            try:
                res = client.table("projects").select("*").execute()
                if res.data is not None:
                    return res.data
            except Exception as e:
                logger.error(f"Error fetching projects: {e}")
        
        return []

    @classmethod
    def get_purchase_orders(cls) -> List[Dict[str, Any]]:
        client = cls.get_client()
        if client:
            try:
                res = client.table("purchase_orders").select("*").execute()
                if res.data is not None:
                    return res.data
            except Exception as e:
                logger.error(f"Error fetching purchase orders: {e}")

        return []

    @classmethod
    def create_purchase_order(cls, po_record: Dict[str, Any]) -> Dict[str, Any]:
        client = cls.get_client()
        if client:
            try:
                res = client.table("purchase_orders").insert(po_record).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Error creating PO: {e}")
        return po_record

    @classmethod
    def save_invoice(cls, invoice_record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        client = cls.get_client()
        if not client:
            return invoice_record

        try:
            res = client.table("invoices").insert(invoice_record).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            logger.error(f"Error saving invoice to Supabase DB: {e}")

        return invoice_record

    @classmethod
    def save_expense(cls, expense_record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        client = cls.get_client()
        if not client:
            return expense_record

        try:
            res = client.table("expenses").insert(expense_record).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            logger.error(f"Error saving expense to Supabase DB: {e}")

        return expense_record

    @classmethod
    def get_purchase_order(cls, po_number: str) -> Optional[Dict[str, Any]]:
        client = cls.get_client()
        if not client:
            return None

        try:
            res = client.table("purchase_orders").select("*").eq("po_number", po_number).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            logger.error(f"Error fetching PO from Supabase: {e}")

        return None
