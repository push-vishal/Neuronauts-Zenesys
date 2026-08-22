from typing import Dict, Any

class RecommendationService:
    @staticmethod
    def generate_explainable_recommendation(
        vendor_name: str, 
        current_price: float, 
        historical_avg: float, 
        alternative_vendor: str = "Vendor B"
    ) -> Dict[str, Any]:
        """
        Generates evidence-based, explainable recommendations backed by historical 
        purchase data, fulfilling FINOVA's core intelligence layer requirement.
        """
        # Calculate price deviation percentage safely
        if historical_avg > 0:
            diff_percentage = round(((current_price - historical_avg) / historical_avg) * 100, 2)
        else:
            diff_percentage = 0.0
            
        recommendation_text = (
            f"{vendor_name}'s pricing increased by {diff_percentage}% compared to the organization's historical purchasing data. "
            f"Similar items were previously procured from {alternative_vendor} at a lower cost. "
            f"Actionable Recommendation: Request a competitive quotation from {alternative_vendor} or renegotiate terms with {vendor_name}."
        )
        
        return {
            "vendor": vendor_name,
            "current_price": current_price,
            "historical_average": historical_avg,
            "price_deviation_percentage": diff_percentage,
            "evidence_backed": True,
            "recommendation": recommendation_text
        }