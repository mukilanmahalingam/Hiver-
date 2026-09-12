import re
from typing import Dict, Any, List
from app.config import BRANDS
from app.models import DecisionExplanation, RiskRadar, HistoricalMatch

class DecisionEngine:
    """Intelligent Decision Matrix evaluating Auto-Handle vs Human Escalation based on multi-factor analysis."""

    def evaluate_decision(
        self,
        message: str,
        brand_id: str,
        intent: str,
        intent_conf: float,
        emotion: str,
        emotion_conf: float,
        urgency_score: int,
        historical_matches: List[Dict[str, Any]],
        override_confidence_threshold: float = None
    ) -> DecisionExplanation:
        
        brand_info = BRANDS.get(brand_id, BRANDS["payvault"])
        auto_threshold = override_confidence_threshold if override_confidence_threshold is not None else brand_info["auto_solve_threshold"]
        
        # 1. Extract dollar amounts for financial risk assessment
        dollar_matches = re.findall(r'\$\s*(\d+(?:\.\d{1,2})?)', message)
        extracted_amounts = [float(a) for a in dollar_matches]
        max_amount = max(extracted_amounts) if extracted_amounts else 0.0

        # 2. Extract Top Vector Similarity Score
        top_sim = historical_matches[0]["similarity_score"] if historical_matches else 0.0

        # 3. Calculate Evidence Score (0 - 100)
        # Aggregates top semantic similarity (50%), intent confidence (30%), emotion clarity (20%)
        evidence_score = round((top_sim * 0.50 + intent_conf * 0.30 + emotion_conf * 0.20) * 100, 1)

        # 4. Multi-Factor Risk Assessment (0.0 to 1.0)
        # Financial risk
        financial_risk = min(1.0, max_amount / (brand_info["max_auto_refund"] * 2)) if brand_info["max_auto_refund"] > 0 else 0.2
        
        # Reputational / Churn risk
        reputational_risk = 0.8 if emotion in ["Angry", "Frustrated"] and urgency_score >= 8 else (0.5 if emotion == "Frustrated" else 0.2)
        
        # Legal & Security compliance risk
        text_lower = message.lower()
        legal_keywords = ["lawyer", "lawsuit", "sue", "attorney", "regulatory", "gdpr breach", "fraud", "stolen"]
        legal_risk = 0.9 if any(k in text_lower for k in legal_keywords) else 0.1
        
        # Security risk
        security_keywords = ["unauthorized", "hacked", "stolen card", "wire transfer", "takeover"]
        security_risk = 0.95 if any(k in text_lower for k in security_keywords) else 0.1

        churn_risk = min(1.0, (urgency_score / 10.0) * 0.7 + (reputational_risk * 0.3))

        risk_radar = RiskRadar(
            financial_risk=round(financial_risk, 2),
            reputational_risk=round(reputational_risk, 2),
            legal_compliance_risk=round(legal_risk, 2),
            churn_risk=round(churn_risk, 2),
            sentiment_urgency_risk=round(urgency_score / 10.0, 2)
        )

        max_risk = max(financial_risk, reputational_risk, legal_risk, security_risk)

        # Risk level string
        if max_risk >= 0.8 or urgency_score >= 9:
            risk_level = "CRITICAL"
        elif max_risk >= 0.5 or urgency_score >= 7:
            risk_level = "HIGH"
        elif max_risk >= 0.3 or urgency_score >= 5:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # 5. SupportDNA Governance Guardrails Checklist
        governance_checks = [
            {
                "check": f"Top Semantic Evidence Similarity (>= 0.35)",
                "passed": bool(top_sim >= 0.35),
                "detail": f"Measured top vector match similarity at {top_sim:.2f}"
            },
            {
                "check": f"Financial Auto-Refund Ceiling (${brand_info['max_auto_refund']:.2f})",
                "passed": bool(max_amount <= brand_info["max_auto_refund"]),
                "detail": f"Requested amount is ${max_amount:.2f}" if max_amount > 0 else "No monetary refund requested"
            },
            {
                "check": "No Mandatory Escalation Trigger Keywords",
                "passed": not any(trig in text_lower for trig in brand_info["escalation_triggers"]),
                "detail": "Clean inquiry text without security/legal escalation flags"
            },
            {
                "check": f"Overall Confidence Score (>= {int(auto_threshold * 100)}%)",
                "passed": bool((evidence_score / 100.0) >= auto_threshold),
                "detail": f"Current evidence score is {evidence_score}%"
            }
        ]

        all_checks_passed = all(c["passed"] for c in governance_checks)

        # 6. Final Decision Action
        if all_checks_passed and risk_level in ["LOW", "MEDIUM"]:
            action = "AUTO_HANDLE"
            primary_reason = f"High historical evidence match ({top_sim:.2f}) and all {brand_info['name']} SupportDNA risk guardrails satisfied."
            checklist = None
        else:
            action = "HUMAN_ESCALATION"
            if not governance_checks[1]["passed"]:
                primary_reason = f"Financial impact (${max_amount:.2f}) exceeds {brand_info['name']} auto-refund limit of ${brand_info['max_auto_refund']:.2f}."
            elif not governance_checks[2]["passed"]:
                primary_reason = f"Security/Regulatory trigger flag detected in customer message."
            elif risk_level in ["HIGH", "CRITICAL"]:
                primary_reason = f"Risk index elevated ({risk_level}) with customer urgency SLA score of {urgency_score}/10."
            else:
                primary_reason = f"Evidence score ({evidence_score}%) below {brand_info['name']} governance threshold ({int(auto_threshold*100)}%)."

            checklist = [
                f"Verify customer identity and recent account transactions for {brand_info['name']}.",
                f"Review historical ticket provenance (Top Match: {historical_matches[0]['ticket_id'] if historical_matches else 'N/A'}).",
                f"Address detected customer emotion ({emotion}) with personalized empathetic response.",
                f"Authorize action if dollar amount (${max_amount:.2f}) is validated."
            ]

        return DecisionExplanation(
            action=action,
            evidence_score=evidence_score,
            confidence=round(intent_conf, 2),
            risk_level=risk_level,
            primary_reason=primary_reason,
            risk_radar=risk_radar,
            governance_checks=governance_checks,
            human_agent_checklist=checklist
        )

# Global singleton
decision_engine = DecisionEngine()
