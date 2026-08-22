from typing import Dict, Any, List

class MatchingService:
    @staticmethod
    def perform_three_way_match(po_data: Dict[str, Any], grn_data: Dict[str, Any], invoice_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Performs three-way matching between Purchase Order (PO), 
        Goods Received Note (GRN), and the parsed Invoice data.
        """
        discrepancies: List[Dict[str, str]] = []
        
        # Check amount deviation between PO and Invoice total
        po_amount = po_data.get("total_amount", 0.0)
        invoice_amount = invoice_data.get("total_amount", 0.0)
        
        if po_amount != invoice_amount:
            discrepancies.append({
                "type": "PO_INVOICE_AMOUNT_MISMATCH",
                "severity": "HIGH",
                "description": f"Purchase Order amount (${po_amount}) does not match Invoice total (${invoice_amount})."
            })
            
        # Check if GRN is verified
        if grn_data.get("status") != "verified":
            discrepancies.append({
                "type": "UNVERIFIED_GRN",
                "severity": "MEDIUM",
                "description": f"Goods Received Note {grn_data.get('grn_number')} is unverified or missing."
            })
            
        return {
            "matched": len(discrepancies) == 0,
            "discrepancy_count": len(discrepancies),
            "discrepancies": discrepancies
        }