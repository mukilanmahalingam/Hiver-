from typing import Dict, List, Any

# Supported Brands & their profiles
BRANDS = {
    "payvault": {
        "id": "payvault",
        "name": "PayVault Financial",
        "industry": "Fintech & Banking",
        "tone": "Formal, Reassuring & Highly Regulated",
        "description": "Secure mobile banking & digital wallet provider.",
        "max_auto_refund": 25.0, # Max financial auto-handle limit
        "auto_solve_threshold": 0.88,
        "escalation_triggers": ["unauthorized_charge", "wire_transfer", "account_takeover", "legal_threat"],
        "color": "cyan",
        "communication_style": {
            "empathy": 85,
            "directness": 90,
            "formality": 95,
            "technicality": 60,
            "speed_target": 120 # seconds
        }
    },
    "techpulse": {
        "id": "techpulse",
        "name": "TechPulse Enterprise",
        "industry": "SaaS & Cloud Software",
        "tone": "Concise, Direct & Technical",
        "description": "Enterprise cloud workspace & productivity suite.",
        "max_auto_refund": 100.0,
        "auto_solve_threshold": 0.80,
        "escalation_triggers": ["outage_critical", "data_loss", "security_breach"],
        "color": "indigo",
        "communication_style": {
            "empathy": 65,
            "directness": 95,
            "formality": 70,
            "technicality": 90,
            "speed_target": 90
        }
    },
    "skywings": {
        "id": "skywings",
        "name": "SkyWings Airlines",
        "industry": "Travel & Aviation",
        "tone": "Empathetic, Urgent & Solution-Oriented",
        "description": "Global commercial airline with loyalty reward programs.",
        "max_auto_refund": 150.0,
        "auto_solve_threshold": 0.85,
        "escalation_triggers": ["missed_flight", "stranded_passenger", "medical_emergency", "lost_baggage_valuable"],
        "color": "amber",
        "communication_style": {
            "empathy": 95,
            "directness": 80,
            "formality": 75,
            "technicality": 50,
            "speed_target": 60
        }
    },
    "streamflix": {
        "id": "streamflix",
        "name": "StreamFlix Media",
        "industry": "Consumer Streaming & Entertainment",
        "tone": "Friendly, Casual & Playful",
        "description": "Global video streaming platform & original content hub.",
        "max_auto_refund": 30.0,
        "auto_solve_threshold": 0.75,
        "escalation_triggers": ["payment_loop_error", "content_geo_restriction"],
        "color": "rose",
        "communication_style": {
            "empathy": 90,
            "directness": 75,
            "formality": 40,
            "technicality": 45,
            "speed_target": 180
        }
    },
    "retailpro": {
        "id": "retailpro",
        "name": "RetailPro Commerce",
        "industry": "E-Commerce & Direct-to-Consumer",
        "tone": "Warm, Helpful & Service-First",
        "description": "Global online retail brand with 2-day delivery.",
        "max_auto_refund": 50.0,
        "auto_solve_threshold": 0.78,
        "escalation_triggers": ["stolen_package_high_val", "hazardous_material", "fraud_alert"],
        "color": "emerald",
        "communication_style": {
            "empathy": 90,
            "directness": 85,
            "formality": 60,
            "technicality": 40,
            "speed_target": 120
        }
    }
}

INTENT_CATEGORIES = [
    "billing_dispute",
    "account_lockout",
    "technical_bug",
    "cancellation_request",
    "shipping_delay",
    "refund_inquiry",
    "feature_request"
]

EMOTION_TYPES = [
    "Frustrated",
    "Angry",
    "Anxious",
    "Neutral",
    "Satisfied",
    "Confused"
]
