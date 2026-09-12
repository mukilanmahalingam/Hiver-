from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class AnalyzeRequest(BaseModel):
    message: str = Field(..., example="I was charged twice $49.99 on my account yesterday and I can't log in now!")
    brand_id: str = Field(default="payvault", example="payvault")
    override_confidence_threshold: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    customer_tier: Optional[str] = Field(default="Standard", example="VIP")

class HistoricalMatch(BaseModel):
    ticket_id: str
    brand_id: str
    customer_query: str
    historical_resolution: str
    similarity_score: float
    outcome: str
    csat: float
    resolved_by: str # e.g. "Auto-Bot v2.4", "Human Specialist Agent #402"

class RiskRadar(BaseModel):
    financial_risk: float
    reputational_risk: float
    legal_compliance_risk: float
    churn_risk: float
    sentiment_urgency_risk: float

class DecisionExplanation(BaseModel):
    action: str # "AUTO_HANDLE" or "HUMAN_ESCALATION"
    evidence_score: float # 0 to 100
    confidence: float # 0 to 1.0
    risk_level: str # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    primary_reason: str
    risk_radar: RiskRadar
    governance_checks: List[Dict[str, Any]] # e.g. [{"check": "Under refund limit", "passed": True}]
    human_agent_checklist: Optional[List[str]] = None

class AnalysisResult(BaseModel):
    intent: str
    intent_confidence: float
    emotion: str
    emotion_confidence: float
    urgency_score: int # 1 to 10
    urgency_level: str # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    suggested_reply: str
    decision: DecisionExplanation
    historical_matches: List[HistoricalMatch]

class EvidenceSearchRequest(BaseModel):
    query: str
    brand_id: Optional[str] = None
    intent: Optional[str] = None
    emotion: Optional[str] = None
    min_similarity: Optional[float] = 0.3
    limit: Optional[int] = 10

class FeedbackItem(BaseModel):
    ticket_id: str
    was_helpful: bool
    agent_correction: Optional[str] = None
    comments: Optional[str] = None
