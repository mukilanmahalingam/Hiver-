from typing import Dict, Any, List
from app.config import BRANDS
from app.data_loader import dataset_manager

class SupportDNAEngine:
    """Manages brand-specific support profiles, governance rules & communication guidelines."""
    
    def get_brand_profile(self, brand_id: str) -> Dict[str, Any]:
        brand_info = BRANDS.get(brand_id, BRANDS["payvault"])
        df = dataset_manager.df
        brand_tickets = df[df["brand_id"] == brand_id]

        total_tickets = len(brand_tickets)
        resolved_cnt = len(brand_tickets[brand_tickets["outcome"].isin(["Resolved", "Refunded"])])
        fcr_rate = round((resolved_cnt / max(1, total_tickets)) * 100, 1)
        avg_csat = round(brand_tickets["csat"].mean(), 2) if total_tickets > 0 else 4.6

        # Top intents distribution
        intent_counts = brand_tickets["intent"].value_counts().to_dict()

        return {
            "brand": brand_info,
            "metrics": {
                "total_historical_tickets": total_tickets,
                "first_contact_resolution_rate": fcr_rate,
                "average_csat": avg_csat,
                "intent_distribution": intent_counts
            },
            "governance_guardrails": [
                {
                    "rule": f"Financial Auto-Refund Ceiling (${brand_info['max_auto_refund']})",
                    "status": "ENFORCED",
                    "description": f"Automated refund cannot exceed ${brand_info['max_auto_refund']} without human agent authorization."
                },
                {
                    "rule": f"Confidence Floor ({int(brand_info['auto_solve_threshold']*100)}%)",
                    "status": "ENFORCED",
                    "description": f"Auto-handling requires at least {int(brand_info['auto_solve_threshold']*100)}% overall evidence confidence."
                },
                {
                    "rule": "Mandatory Escalation Triggers",
                    "status": "ACTIVE",
                    "description": f"Queries containing triggers ({', '.join(brand_info['escalation_triggers'])}) immediately route to human specialist."
                }
            ]
        }

    def get_all_profiles(self) -> List[Dict[str, Any]]:
        return [self.get_brand_profile(b_id) for b_id in BRANDS.keys()]

# Global singleton
dna_engine = SupportDNAEngine()
