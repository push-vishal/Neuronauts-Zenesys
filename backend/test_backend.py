import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.matching_service import MatchingService
from backend.services.recommendation_service import RecommendationService
from backend.services.gemini_service import GeminiService

client = TestClient(app)

class TestFinovaBackend(unittest.TestCase):
    def test_health(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("FINOVA", data["app"])

    def test_matching_service_exact_match(self):
        po = {"po_number": "PO-101", "total_amount": 1500.0}
        grn = {"grn_number": "GRN-101", "status": "verified"}
        inv = {"total_amount": 1500.0}
        result = MatchingService.perform_three_way_match(po, grn, inv)
        self.assertTrue(result["matched"])
        self.assertEqual(result["discrepancy_count"], 0)

    def test_matching_service_mismatch(self):
        po = {"po_number": "PO-102", "total_amount": 1500.0}
        grn = {"grn_number": "GRN-102", "status": "pending"}
        inv = {"total_amount": 1800.0}
        result = MatchingService.perform_three_way_match(po, grn, inv)
        self.assertFalse(result["matched"])
        self.assertEqual(result["discrepancy_count"], 2)

    def test_recommendation_service(self):
        rec = RecommendationService.generate_explainable_recommendation(
            vendor_name="Acme Tech",
            current_price=150.0,
            historical_avg=100.0,
            alternative_vendor="Beta Logistics"
        )
        self.assertEqual(rec["price_deviation_percentage"], 50.0)
        self.assertTrue(rec["evidence_backed"])
        self.assertIn("Acme Tech", rec["recommendation"])
        self.assertIn("Beta Logistics", rec["recommendation"])

    def test_gemini_service_mock(self):
        mock_data = GeminiService._get_mock_invoice_data()
        self.assertIn("invoice_number", mock_data)
        self.assertIn("total_amount", mock_data)
        self.assertIn("line_items", mock_data)

    def test_api_projects(self):
        response = client.get("/api/v1/projects/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("projects", data)
        self.assertIn("total_budget", data)
        self.assertIn("total_spend", data)

    def test_api_procurement_pos(self):
        response = client.get("/api/v1/procurement/pos")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("purchase_orders", data)

    def test_api_procurement_create_po(self):
        po_payload = {
            "po_number": "PO-TEST-001",
            "vendor_name": "Test Vendor Ltd",
            "total_amount": 999.99,
            "status": "issued"
        }
        response = client.post("/api/v1/procurement/pos", json=po_payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["status"], "success")

    def test_api_expense_submit(self):
        expense_payload = {
            "employee_name": "Jane Doe",
            "project_name": "Cloud Infrastructure",
            "amount": 249.50,
            "category": "Travel",
            "receipt_url": "https://example.com/receipt.png"
        }
        response = client.post("/api/v1/expenses/", json=expense_payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["status"], "success")

    def test_api_invoice_upload_audit_no_file(self):
        response = client.post("/api/v1/invoices/upload")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "audited")
        self.assertIn("anomalies", data)
        self.assertIn("three_way_match", data)
    def test_api_erp_netsuite_status(self):
        response = client.get("/api/v1/erp/netsuite/status")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("NetSuite", data["erp_system"])
        self.assertIn("VendorBill", data["supported_record_types"])

    def test_api_erp_netsuite_sync(self):
        response = client.post("/api/v1/erp/netsuite/sync")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertGreater(data["records_synced_count"], 0)
        self.assertTrue(any(r["record_type"] == "VendorBill" for r in data["synced_records"]))

    def test_api_erp_post_journal(self):
        payload = {
            "invoice_ref": "INV-2026-9901",
            "vendor_name": "Cloud Providers Inc",
            "amount": 12500.00,
            "category": "Software"
        }
        response = client.post("/api/v1/erp/netsuite/post-journal", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["status"], "success")
        journal = data["journal"]
        self.assertTrue(journal["is_balanced"])
        self.assertEqual(journal["total_debit"], 12500.00)
        self.assertEqual(journal["total_credit"], 12500.00)

    def test_api_erp_gl_accounts_and_commitments(self):
        res_gl = client.get("/api/v1/erp/gl-accounts")
        self.assertEqual(res_gl.status_code, 200)
        self.assertIn("chart_of_accounts", res_gl.json())

        res_comm = client.get("/api/v1/erp/commitments")
        self.assertEqual(res_comm.status_code, 200)
        data = res_comm.json()
        self.assertIn("total_budget", data)
        self.assertIn("total_encumbered_pos", data)

    def test_api_dynamic_invoices_and_expenses_listing(self):
        inv_res = client.get("/api/v1/invoices/")
        self.assertEqual(inv_res.status_code, 200)
        self.assertIn("invoices", inv_res.json())

        exp_res = client.get("/api/v1/expenses/")
        self.assertEqual(exp_res.status_code, 200)
        self.assertIn("expenses", exp_res.json())

    def test_api_dynamic_vendors_listing_and_creation(self):
        v_list = client.get("/api/v1/procurement/vendors")
        self.assertEqual(v_list.status_code, 200)
        self.assertIn("vendors", v_list.json())

        v_create = client.post("/api/v1/procurement/vendors", json={
            "name": "Datadog Cloud Observability",
            "category": "Software & Cloud Services",
            "email": "enterprise@datadog.com"
        })
        self.assertEqual(v_create.status_code, 201)
        self.assertEqual(v_create.json()["status"], "success")

    def test_api_dynamic_projects_creation(self):
        p_create = client.post("/api/v1/projects/", json={
            "project_code": "PRJ-QUANTUM",
            "project_name": "Quantum AI Infrastructure",
            "budget_amount": 500000.0
        })
        self.assertEqual(p_create.status_code, 201)
        self.assertEqual(p_create.json()["status"], "success")

    def test_api_dynamic_recommendations_and_analytics(self):
        rec_res = client.get("/api/v1/recommendations/")
        self.assertEqual(rec_res.status_code, 200)
        self.assertIn("recommendations", rec_res.json())

        ana_res = client.get("/api/v1/analytics/")
        self.assertEqual(ana_res.status_code, 200)
        self.assertIn("categories", ana_res.json())
        self.assertIn("monthly_trend", ana_res.json())

if __name__ == "__main__":
    unittest.main()
