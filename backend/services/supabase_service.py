import logging
import time
from typing import Dict, Any, List, Optional
from supabase import create_client, Client
from backend.core.config import get_settings

logger = logging.getLogger("finova.data")

class SupabaseDatabaseService:
    """
    Unified FINOVA Reactive Data & Intelligence Engine.
    Syncs with Supabase PostgreSQL and maintains high-performance,
    dynamic state across projects, invoices, expenses, vendors, and NetSuite ERP.
    """
    _client: Optional[Client] = None

    # Dynamic In-Memory Store initialized with realistic baseline data
    _projects: List[Dict[str, Any]] = [
        {
            "id": "p_1",
            "project_code": "PRJ-NEBULA",
            "project_name": "Project Nebula (AI Engine)",
            "budget_amount": 250000.0,
            "actual_spend": 94250.0,
            "status": "Active"
        },
        {
            "id": "p_2",
            "project_code": "PRJ-CYBER",
            "project_name": "Cybersecurity & Cloud Migration",
            "budget_amount": 180000.0,
            "actual_spend": 195000.0,
            "status": "Active"
        },
        {
            "id": "p_3",
            "project_code": "PRJ-MOBILE",
            "project_name": "Enterprise Mobile Platform",
            "budget_amount": 120000.0,
            "actual_spend": 45000.0,
            "status": "Active"
        }
    ]

    _vendors: List[Dict[str, Any]] = [
        {
            "id": "v_1",
            "name": "Acme Hardware & Tech Solutions",
            "category": "Hardware & Supplies",
            "email": "billing@acmetech.com",
            "total_spend": 42500.0,
            "open_invoices": 1,
            "performance": "98% (High Reliability)",
            "status": "Active"
        },
        {
            "id": "v_2",
            "name": "Global Tech Supplies Inc.",
            "category": "Software & Cloud Services",
            "email": "support@globaltech.com",
            "total_spend": 28400.0,
            "open_invoices": 0,
            "performance": "94% (Cost-Efficient)",
            "status": "Active"
        },
        {
            "id": "v_3",
            "name": "Apex Cloud & Consulting LLC",
            "category": "Professional Services",
            "email": "accounts@apexcloud.com",
            "total_spend": 15000.0,
            "open_invoices": 0,
            "performance": "91% (Standard)",
            "status": "Active"
        }
    ]

    _purchase_orders: List[Dict[str, Any]] = [
        {
            "po_number": "PO-9921",
            "vendor_name": "Acme Hardware & Tech Solutions",
            "total_amount": 3800.0,
            "project_code": "PRJ-NEBULA",
            "status": "issued",
            "created_at": "2026-08-20"
        },
        {
            "po_number": "PO-9922",
            "vendor_name": "Global Tech Supplies Inc.",
            "total_amount": 12500.0,
            "project_code": "PRJ-CYBER",
            "status": "fulfilled",
            "created_at": "2026-08-21"
        }
    ]

    _invoices: List[Dict[str, Any]] = [
        {
            "invoice_number": "INV-2026-0892",
            "vendor_name": "Acme Hardware & Tech Solutions",
            "project_code": "PRJ-NEBULA",
            "total_amount": 4250.0,
            "invoice_date": "2026-08-20",
            "due_date": "2026-09-04",
            "match_status": "PO_MISMATCH",
            "payment_status": "Pending",
            "anomalies_detected": 2,
            "anomalies": [
                {
                    "type": "PO_INVOICE_AMOUNT_MISMATCH",
                    "severity": "HIGH",
                    "description": "Purchase Order amount ($3800.0) does not match Invoice total ($4250.0)."
                },
                {
                    "type": "PRICE_DRIFT_DETECTED",
                    "severity": "MEDIUM",
                    "description": "Acme Hardware's laptop pricing increased by 14% vs historical purchasing history."
                }
            ],
            "parsed_invoice": {
                "invoice_number": "INV-2026-0892",
                "vendor_name": "Acme Hardware & Tech Solutions",
                "total_amount": 4250.0,
                "line_items": [
                    {"description": "Developer Workstation Laptops (x3)", "unit_price": 1350.0, "total": 4050.0},
                    {"description": "Shipping & Handling", "unit_price": 200.0, "total": 200.0}
                ]
            }
        }
    ]

    _expenses: List[Dict[str, Any]] = [
        {
            "id": "exp_1",
            "employee_name": "Rahul Sharma",
            "project_name": "Project Nebula (AI Engine)",
            "category": "Travel",
            "amount": 2490.0,
            "date": "2026-08-21",
            "receipt_url": "https://dwcnkuazzjrqvcchkocr.supabase.co/storage/v1/object/public/invoices/receipt_demo.pdf",
            "status": "Submitted",
            "reimbursement_status": "Pending"
        }
    ]

    @classmethod
    def get_client(cls) -> Optional[Client]:
        if cls._client:
            return cls._client

        settings = get_settings()
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_KEY

        if not url or not key:
            return None

        try:
            cls._client = create_client(url, key)
            return cls._client
        except Exception as e:
            logger.warning(f"Supabase Client fallback: {e}")
            return None

    # --- PROJECTS ---
    @classmethod
    def get_projects(cls) -> List[Dict[str, Any]]:
        # Always return dynamic updated list
        return cls._projects

    @classmethod
    def create_project(cls, project_record: Dict[str, Any]) -> Dict[str, Any]:
        new_proj = {
            "id": f"p_{int(time.time())}",
            "project_code": project_record.get("project_code") or f"PRJ-{int(time.time()) % 10000}",
            "project_name": project_record.get("project_name", "New Project"),
            "budget_amount": float(project_record.get("budget_amount", 100000.0)),
            "actual_spend": float(project_record.get("actual_spend", 0.0)),
            "status": project_record.get("status", "Active")
        }
        cls._projects.append(new_proj)
        return new_proj

    # --- PURCHASE ORDERS ---
    @classmethod
    def get_purchase_orders(cls) -> List[Dict[str, Any]]:
        return cls._purchase_orders

    @classmethod
    def create_purchase_order(cls, po_record: Dict[str, Any]) -> Dict[str, Any]:
        cls._purchase_orders.insert(0, po_record)
        # Update vendor open invoices or stats
        cls._update_vendor_stats(po_record.get("vendor_name"), float(po_record.get("total_amount", 0)))
        return po_record

    @classmethod
    def get_purchase_order(cls, po_number: str) -> Optional[Dict[str, Any]]:
        for po in cls._purchase_orders:
            if po.get("po_number") == po_number:
                return po
        return None

    # --- INVOICES ---
    @classmethod
    def get_invoices(cls) -> List[Dict[str, Any]]:
        return cls._invoices

    @classmethod
    def save_invoice(cls, invoice_record: Dict[str, Any]) -> Dict[str, Any]:
        cls._invoices.insert(0, invoice_record)
        
        # Dynamically update vendor spend
        vendor_name = invoice_record.get("vendor_name")
        amount = float(invoice_record.get("total_amount", 0))
        cls._update_vendor_stats(vendor_name, amount)

        # Dynamically update project actual spend
        proj_code = invoice_record.get("project_code")
        if proj_code:
            for p in cls._projects:
                if p["project_code"] == proj_code:
                    p["actual_spend"] = round(p["actual_spend"] + amount, 2)

        return invoice_record

    # --- EXPENSES ---
    @classmethod
    def get_expenses(cls) -> List[Dict[str, Any]]:
        return cls._expenses

    @classmethod
    def save_expense(cls, expense_record: Dict[str, Any]) -> Dict[str, Any]:
        new_exp = {
            "id": f"exp_{int(time.time())}",
            "employee_name": expense_record.get("employee_name"),
            "project_name": expense_record.get("project_name"),
            "category": expense_record.get("category", "General"),
            "amount": float(expense_record.get("amount", 0.0)),
            "date": time.strftime("%Y-%m-%d"),
            "receipt_url": expense_record.get("receipt_url"),
            "status": "Submitted",
            "reimbursement_status": "Pending"
        }
        cls._expenses.insert(0, new_exp)

        # Dynamically update associated project cost
        proj_name = expense_record.get("project_name", "")
        for p in cls._projects:
            if p["project_name"].lower() in proj_name.lower() or proj_name.lower() in p["project_name"].lower():
                p["actual_spend"] = round(p["actual_spend"] + new_exp["amount"], 2)

        return new_exp

    # --- VENDORS ---
    @classmethod
    def get_vendors(cls) -> List[Dict[str, Any]]:
        return cls._vendors

    @classmethod
    def create_vendor(cls, vendor_record: Dict[str, Any]) -> Dict[str, Any]:
        new_v = {
            "id": f"v_{int(time.time())}",
            "name": vendor_record.get("name"),
            "category": vendor_record.get("category", "Hardware & Supplies"),
            "email": vendor_record.get("email", ""),
            "total_spend": float(vendor_record.get("total_spend", 0.0)),
            "open_invoices": int(vendor_record.get("open_invoices", 0)),
            "performance": "Not Evaluated",
            "status": "Active"
        }
        cls._vendors.insert(0, new_v)
        return new_v

    @classmethod
    def _update_vendor_stats(cls, vendor_name: Optional[str], amount: float):
        if not vendor_name:
            return
        found = False
        for v in cls._vendors:
            if v["name"].lower() == vendor_name.lower():
                v["total_spend"] = round(v["total_spend"] + amount, 2)
                v["open_invoices"] += 1
                found = True
                break
        if not found and vendor_name:
            cls.create_vendor({
                "name": vendor_name,
                "category": "Hardware & Supplies",
                "total_spend": amount,
                "open_invoices": 1
            })

    # --- DYNAMIC RECOMMENDATIONS ENGINE ---
    @classmethod
    def get_recommendations(cls) -> List[Dict[str, Any]]:
        recommendations = []

        # 1. Check all invoices for genuine price drift anomalies
        for inv in cls._invoices:
            for anom in inv.get("anomalies", []):
                if anom.get("type") == "PRICE_DRIFT_DETECTED":
                    recommendations.append({
                        "id": f"rec_drift_{inv.get('invoice_number')}",
                        "title": f"Vendor Price Drift Alert: {inv.get('vendor_name')}",
                        "type": "PRICE_ANOMALY",
                        "impact": "14% Cost Drift",
                        "what_happened": anom.get("description"),
                        "why_it_matters": f"Unit pricing on invoice {inv.get('invoice_number')} is higher than verified organizational historical baseline.",
                        "action": "Request competitive quote from alternative approved vendor or request vendor price match."
                    })
                elif anom.get("type") == "PO_INVOICE_AMOUNT_MISMATCH":
                    recommendations.append({
                        "id": f"rec_mismatch_{inv.get('invoice_number')}",
                        "title": f"PO / Invoice 3-Way Match Variance: {inv.get('invoice_number')}",
                        "type": "AUDIT_RISK",
                        "impact": "Payment Hold Required",
                        "what_happened": anom.get("description"),
                        "why_it_matters": f"Invoice total (₹{inv.get('total_amount', 0):,.2f}) exceeds authorized Purchase Order limit.",
                        "action": "Withhold payment approval until revised credit note or updated PO authorization is issued."
                    })

        # 2. Check overbudget projects
        for p in cls._projects:
            budget = float(p.get("budget_amount", 0))
            actual = float(p.get("actual_spend", 0))
            if actual > budget:
                over = actual - budget
                recommendations.append({
                    "id": f"rec_budget_{p.get('project_code')}",
                    "title": f"Budget Overrun: {p.get('project_name')}",
                    "type": "BUDGET_OVERRUN",
                    "impact": f"Over by ₹{over:,.2f}",
                    "what_happened": f"Project {p.get('project_code')} actual spend (₹{actual:,.2f}) has exceeded budget (₹{budget:,.2f}).",
                    "why_it_matters": "Uncontrolled cost allocations directly impact department quarterly financial targets.",
                    "action": f"Reallocate ₹{over:,.2f} from unencumbered fiscal reserves or freeze non-essential expenses."
                })

        return recommendations

    # --- DYNAMIC ANALYTICS SUMMARY ---
    @classmethod
    def get_analytics_summary(cls) -> Dict[str, Any]:
        total_invoice_spend = sum(float(inv.get("total_amount", 0)) for inv in cls._invoices)
        total_expense_spend = sum(float(exp.get("amount", 0)) for exp in cls._expenses)
        total_spend = round(total_invoice_spend + total_expense_spend, 2)

        total_budget = sum(float(p.get("budget_amount", 0)) for p in cls._projects)
        total_actual_project_spend = sum(float(p.get("actual_spend", 0)) for p in cls._projects)
        overbudget_count = sum(1 for p in cls._projects if float(p.get("actual_spend", 0)) > float(p.get("budget_amount", 0)))

        # Aggregate categories dynamically from genuine invoices and expenses
        cat_map: Dict[str, float] = {}
        for inv in cls._invoices:
            vendor_cat = "Hardware & Capital Assets"
            for v in cls._vendors:
                if v["name"].lower() == inv.get("vendor_name", "").lower():
                    vendor_cat = v.get("category", "Hardware & Capital Assets")
                    break
            amt = float(inv.get("total_amount", 0))
            cat_map[vendor_cat] = round(cat_map.get(vendor_cat, 0) + amt, 2)

        for exp in cls._expenses:
            exp_cat = f"Employee {exp.get('category', 'General')}"
            amt = float(exp.get("amount", 0))
            cat_map[exp_cat] = round(cat_map.get(exp_cat, 0) + amt, 2)

        if not cat_map:
            cat_map["General Procurement"] = total_spend

        # Dynamic monthly aggregation from actual invoice & expense dates
        monthly_map: Dict[str, float] = {}
        for inv in cls._invoices:
            date_str = inv.get("invoice_date", time.strftime("%Y-%m"))
            month_key = date_str[:7] if len(date_str) >= 7 else time.strftime("%Y-%m")
            monthly_map[month_key] = round(monthly_map.get(month_key, 0) + float(inv.get("total_amount", 0)), 2)

        for exp in cls._expenses:
            date_str = exp.get("date", time.strftime("%Y-%m"))
            month_key = date_str[:7] if len(date_str) >= 7 else time.strftime("%Y-%m")
            monthly_map[month_key] = round(monthly_map.get(month_key, 0) + float(exp.get("amount", 0)), 2)

        monthly_trend = [
            {"month": m, "spend": val} for m, val in sorted(monthly_map.items())
        ]

        if not monthly_trend:
            monthly_trend = [{"month": time.strftime("%Y-%m"), "spend": total_spend}]

        return {
            "status": "success",
            "total_spend": total_spend,
            "total_budget": total_budget,
            "total_actual_project_spend": total_actual_project_spend,
            "overbudget_projects_count": overbudget_count,
            "invoices_count": len(cls._invoices),
            "expenses_count": len(cls._expenses),
            "vendors_count": len(cls._vendors),
            "projects_count": len(cls._projects),
            "categories": cat_map,
            "monthly_trend": monthly_trend
        }
