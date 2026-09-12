from typing import List, Dict, Any
from app.config import BRANDS

class ResponseGenerator:
    """Generates brand-tailored, evidence-grounded responses."""
    
    def generate_reply(
        self,
        customer_message: str,
        brand_id: str,
        intent: str,
        emotion: str,
        action: str,
        historical_matches: List[Dict[str, Any]]
    ) -> str:
        brand_info = BRANDS.get(brand_id, BRANDS["payvault"])
        top_match = historical_matches[0] if historical_matches else None
        evidence_res = top_match["historical_resolution"] if top_match else "Our team will review your inquiry shortly."

        # Brand specific greetings & sign-offs
        if brand_id == "payvault":
            greeting = "Hello from PayVault Support,"
            signoff = "\n\nSincerely,\nPayVault Account Services & Governance Team"
        elif brand_id == "techpulse":
            greeting = "Hi,"
            signoff = "\n\nBest regards,\nTechPulse Cloud Operations"
        elif brand_id == "skywings":
            greeting = "Dear Passenger,"
            signoff = "\n\nWarm regards,\nSkyWings Passenger Care Team"
        elif brand_id == "streamflix":
            greeting = "Hey there! 👋,"
            signoff = "\n\nHappy Streaming!\nThe StreamFlix Crew"
        else:
            greeting = "Hello,"
            signoff = "\n\nBest regards,\nRetailPro Customer Support"

        # Empathy line based on emotion
        if emotion in ["Frustrated", "Angry"]:
            empathy = " We sincerely apologize for the inconvenience and frustration this issue has caused."
        elif emotion == "Anxious":
            empathy = " We understand your concern and want to reassure you that we are on it."
        else:
            empathy = " Thank you for reaching out to us today."

        # Grounded resolution block
        if action == "AUTO_HANDLE":
            body = (
                f"{greeting}{empathy}\n\n"
                f"Based on our support records for {intent.replace('_', ' ')}, we have processed your request: "
                f"{evidence_res}"
                f"{signoff}"
            )
        else:
            body = (
                f"[DRAFT AGENT RESPONSE - HUMAN REVIEW REQUIRED]\n"
                f"{greeting}{empathy}\n\n"
                f"We have flagged your inquiry regarding {intent.replace('_', ' ')} for priority specialist review. "
                f"Historical evidence suggestion: '{evidence_res}'. "
                f"A dedicated agent will confirm your details and complete this action within 15 minutes."
                f"{signoff}"
            )

        return body

# Global singleton
response_generator = ResponseGenerator()
