import pandas as pd
import random
from typing import List, Dict, Any
from app.config import BRANDS, INTENT_CATEGORIES, EMOTION_TYPES

# Seed for reproducibility
random.seed(42)

# Templates for synthetic generation across 5 brands
TICKET_TEMPLATES = {
    "billing_dispute": [
        ("I was billed twice for ${amount} on my {brand_name} subscription. Please refund the extra charge immediately!", "Frustrated", 8, "Refunded", 4.8),
        ("Why is there an unexpected ${amount} fee on my monthly invoice for {brand_name}?", "Angry", 7, "Resolved", 4.5),
        ("I canceled my subscription last week, but {brand_name} still deducted ${amount} from my card.", "Angry", 9, "Refunded", 4.9),
        ("Can someone explain this itemized charge of ${amount} on account ID {acc_id}?", "Confused", 4, "Resolved", 4.2),
        ("Overcharged by ${amount} during billing cycle renewal. Need correction.", "Neutral", 5, "Refunded", 4.6),
        ("I see a duplicate pending transaction of ${amount} from {brand_name} online.", "Anxious", 6, "Resolved", 4.4)
    ],
    "account_lockout": [
        ("I am completely locked out of my {brand_name} account! It says invalid 2FA code.", "Anxious", 9, "Resolved", 4.7),
        ("Forgot my password and the reset link for {brand_name} is not arriving in my inbox.", "Frustrated", 7, "Resolved", 4.3),
        ("My account was suspended for suspicious activity, but I didn't do anything wrong!", "Angry", 10, "Escalated", 4.1),
        ("Cannot log into my {brand_name} dashboard on mobile app. Getting error code 403.", "Frustrated", 6, "Resolved", 4.4),
        ("Need to update my primary email address on file because old domain expired.", "Neutral", 4, "Resolved", 4.8)
    ],
    "technical_bug": [
        ("The main dashboard on {brand_name} crashes every time I export my monthly report.", "Frustrated", 7, "Resolved", 4.5),
        ("Video playback on {brand_name} keeps buffering and showing error code ERR_NET_TIMEOUT.", "Frustrated", 6, "Resolved", 4.2),
        ("API webhooks are failing with 502 Bad Gateway response since the latest deployment.", "Angry", 8, "Escalated", 4.0),
        ("App freezes on step 3 during checkout when clicking complete order.", "Frustrated", 8, "Resolved", 4.6),
        ("Search filter is returning empty results even when matching records exist.", "Confused", 5, "Resolved", 4.7)
    ],
    "cancellation_request": [
        ("I want to cancel my {brand_name} plan at the end of the current billing cycle.", "Neutral", 4, "Resolved", 4.9),
        ("Please close my account permanently and delete all stored personal data under GDPR.", "Neutral", 5, "Resolved", 4.8),
        ("Trying to downgrade from Enterprise to Starter plan, but system says contact support.", "Confused", 5, "Resolved", 4.6),
        ("Cancel my auto-renewal immediately. I no longer require {brand_name} services.", "Frustrated", 7, "Resolved", 4.5)
    ],
    "shipping_delay": [
        ("My package #TRK{trk_id} was supposed to arrive 3 days ago according to {brand_name}.", "Frustrated", 8, "Refunded", 4.3),
        ("Tracking status says 'Delivered', but I checked my porch and front desk and it's missing!", "Angry", 9, "Escalated", 4.1),
        ("Where is my order? Shipping hasn't updated since leaving the distribution warehouse.", "Anxious", 7, "Resolved", 4.4),
        ("Need to change delivery address for shipment #TRK{trk_id} before it gets dispatched.", "Anxious", 6, "Resolved", 4.7)
    ],
    "refund_inquiry": [
        ("How long does it take for a credit card refund of ${amount} to reflect in my bank account?", "Neutral", 3, "Resolved", 4.9),
        ("I returned the item last week to {brand_name}. When will my refund be processed?", "Anxious", 6, "Resolved", 4.6),
        ("Requesting a full refund due to broken item received in shipment.", "Angry", 8, "Refunded", 4.7),
        ("Pro-rated refund request for unused subscription days after tier downgrade.", "Neutral", 4, "Refunded", 4.8)
    ],
    "feature_request": [
        ("Would love to see Dark Mode support added to the {brand_name} web app!", "Satisfied", 2, "Resolved", 4.9),
        ("Is there an integration available for Slack or Microsoft Teams?", "Satisfied", 3, "Resolved", 4.8),
        ("Can you add multi-currency export options for international accounting?", "Neutral", 3, "Resolved", 4.7),
        ("Requesting bulk download option for invoice PDFs in account settings.", "Neutral", 3, "Resolved", 4.8)
    ]
}

HISTORICAL_SOLUTIONS = {
    "billing_dispute": [
        "Verified duplicate transaction on {date}. Issued full refund of ${amount} to original payment method. Advised customer on 3-5 business day processing timeline.",
        "Reviewed invoice logs. Clarified that the charge corresponds to annual renewal term. Applied a $10 promotional goodwill credit as courtesy.",
        "Inspected payment processor authorization logs. Identified temporary pre-authorization hold which automatically released within 24 hours."
    ],
    "account_lockout": [
        "Verified user identity via security PIN. Reset 2FA authentication device and sent password reset link to verified recovery email.",
        "Unlocked account after performing IP fraud check. Sent clear instructions to re-register multi-factor authenticator app.",
        "Escalated to Tier 2 Security Operations team to review automated flag. Account restored within 45 minutes."
    ],
    "technical_bug": [
        "Reproduced export crash bug on Chrome v122. Cleared user cache, applied server patch hotfix, and confirmed issue resolution.",
        "Identified CDN edge routing glitch affecting video streams. Rerouted stream traffic to backup edge server.",
        "Forwarded API log trace to Senior DevOps Engineer. Created bug ticket #DEV-892 with high priority."
    ],
    "cancellation_request": [
        "Processed subscription cancellation request. Sent email confirmation confirming access until end of current cycle on {date}.",
        "Processed account termination and initiated GDPR data deletion sequence per customer request.",
        "Assisted customer in switching from Pro plan to Starter plan with zero service interruption."
    ],
    "shipping_delay": [
        "Contacted logistics carrier. Located package in transit delay due to weather. Re-dispatched replacement order via Express Shipping.",
        "Initiated carrier trace for package marked delivered. Issued full replacement order + $15 voucher for inconvenience.",
        "Updated delivery destination address with courier before truck departure."
    ],
    "refund_inquiry": [
        "Confirmed return package received at warehouse. Approved refund of ${amount} back to credit card ending in ****.",
        "Explained standard 3-5 banking business day processing timeline for ACH and card refunds.",
        "Issued instant store credit refund for returned damaged merchandise per store policy."
    ],
    "feature_request": [
        "Logged product feature request under ticket #FEAT-1492 for the Product Roadmap team. Notified customer of planned Q3 release.",
        "Shared documentation link for existing Slack integration webhook setup.",
        "Notified product manager regarding multi-currency CSV export request."
    ]
}


class DatasetManager:
    """Manages historical support conversations across brands."""
    def __init__(self):
        self.df = self._generate_dataset(num_records=1050)
    
    def _generate_dataset(self, num_records: int = 1050) -> pd.DataFrame:
        records = []
        brand_keys = list(BRANDS.keys())
        
        for i in range(1, num_records + 1):
            brand_id = random.choice(brand_keys)
            brand_info = BRANDS[brand_id]
            intent = random.choice(INTENT_CATEGORIES)
            
            template_tuple = random.choice(TICKET_TEMPLATES[intent])
            raw_text, emotion, base_urgency, outcome, csat = template_tuple
            
            amount = round(random.uniform(9.99, 199.99), 2)
            acc_id = f"ACC-{random.randint(10000, 99999)}"
            trk_id = f"{random.randint(1000000, 9999999)}"
            date = f"2026-0${random.randint(1, 8)}-{random.randint(10, 28)}"
            
            query = raw_text.format(
                amount=amount,
                brand_name=brand_info["name"],
                acc_id=acc_id,
                trk_id=trk_id
            )
            
            sol_template = random.choice(HISTORICAL_SOLUTIONS[intent])
            resolution = sol_template.format(
                amount=amount,
                date=date
            )
            
            # Financial impact calculation
            financial_impact = amount if intent in ["billing_dispute", "refund_inquiry"] else 0.0
            
            # Resolved by agent role
            resolved_by = random.choice([
                "Auto-Bot v2.4 (SupportDNA Engine)",
                "Tier 1 Support Agent",
                "Senior Escalation Specialist",
                "Tier 2 Security Agent"
            ])
            
            records.append({
                "ticket_id": f"TKT-{brand_id.upper()}-{10000 + i}",
                "brand_id": brand_id,
                "brand_name": brand_info["name"],
                "intent": intent,
                "emotion": emotion,
                "urgency_score": min(10, max(1, base_urgency + random.randint(-1, 1))),
                "customer_query": query,
                "historical_resolution": resolution,
                "outcome": outcome,
                "csat": round(csat + random.uniform(-0.3, 0.2), 1),
                "financial_impact": financial_impact,
                "resolved_by": resolved_by,
                "evidence_strength": round(random.uniform(0.75, 0.99), 2)
            })
            
        df = pd.DataFrame(records)
        return df

    def get_all(self) -> List[Dict[str, Any]]:
        return self.df.to_dict(orient="records")

    def get_filtered(self, brand_id: str = None, intent: str = None, emotion: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        filtered_df = self.df.copy()
        if brand_id:
            filtered_df = filtered_df[filtered_df["brand_id"] == brand_id]
        if intent:
            filtered_df = filtered_df[filtered_df["intent"] == intent]
        if emotion:
            filtered_df = filtered_df[filtered_df["emotion"] == emotion]
        
        return filtered_df.head(limit).to_dict(orient="records")

# Global singleton
dataset_manager = DatasetManager()
