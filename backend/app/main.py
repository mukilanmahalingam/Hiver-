from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from app.models import (
    AnalyzeRequest, AnalysisResult, EvidenceSearchRequest,
    HistoricalMatch, FeedbackItem
)
from app.config import BRANDS, INTENT_CATEGORIES, EMOTION_TYPES
from app.data_loader import dataset_manager
from app.classifier import classifier_engine
from app.vector_search import vector_search_engine
from app.dna_engine import dna_engine
from app.decision_engine import decision_engine
from app.response_generator import response_generator
from app.evaluation import evaluation_engine

app = FastAPI(
    title="SupportDNA AI API",
    description="Enterprise AI Customer Support Decision & Governance Engine",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "SupportDNA AI Engine",
        "total_historical_conversations": len(dataset_manager.df),
        "brands_supported": list(BRANDS.keys())
    }

@app.post("/api/analyze", response_model=AnalysisResult)
def analyze_message(req: AnalyzeRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Customer message cannot be empty.")
    
    # 1. Intent Detection
    intent, intent_conf = classifier_engine.predict_intent(req.message)

    # 2. Emotion Detection
    emotion, emotion_conf = classifier_engine.predict_emotion(req.message)

    # 3. Urgency SLA Calculation
    urgency_score, urgency_level = classifier_engine.calculate_urgency(req.message, emotion, intent)

    # 4. Semantic Vector Search across Historical Tickets
    raw_matches = vector_search_engine.search(
        query=req.message,
        brand_id=req.brand_id,
        top_k=5
    )

    # Convert to HistoricalMatch models
    historical_matches = [
        HistoricalMatch(
            ticket_id=m["ticket_id"],
            brand_id=m["brand_id"],
            customer_query=m["customer_query"],
            historical_resolution=m["historical_resolution"],
            similarity_score=m["similarity_score"],
            outcome=m["outcome"],
            csat=m["csat"],
            resolved_by=m["resolved_by"]
        )
        for m in raw_matches
    ]

    # 5. Intelligent Decision System (Auto-Handle vs Escalation & Evidence Score)
    decision = decision_engine.evaluate_decision(
        message=req.message,
        brand_id=req.brand_id,
        intent=intent,
        intent_conf=intent_conf,
        emotion=emotion,
        emotion_conf=emotion_conf,
        urgency_score=urgency_score,
        historical_matches=[m.model_dump() for m in historical_matches],
        override_confidence_threshold=req.override_confidence_threshold
    )

    # 6. Generate Brand-Aligned Grounded Response
    suggested_reply = response_generator.generate_reply(
        customer_message=req.message,
        brand_id=req.brand_id,
        intent=intent,
        emotion=emotion,
        action=decision.action,
        historical_matches=[m.model_dump() for m in historical_matches]
    )

    return AnalysisResult(
        intent=intent,
        intent_confidence=intent_conf,
        emotion=emotion,
        emotion_confidence=emotion_conf,
        urgency_score=urgency_score,
        urgency_level=urgency_level,
        suggested_reply=suggested_reply,
        decision=decision,
        historical_matches=historical_matches
    )

@app.post("/api/evidence/search")
def search_evidence(req: EvidenceSearchRequest):
    results = vector_search_engine.search(
        query=req.query,
        brand_id=req.brand_id,
        intent=req.intent,
        emotion=req.emotion,
        top_k=req.limit or 10
    )
    return {
        "query": req.query,
        "total_results": len(results),
        "matches": results
    }

@app.get("/api/brands")
def get_brands():
    return list(BRANDS.values())

@app.get("/api/brands/{brand_id}/dna")
def get_brand_dna(brand_id: str):
    profile = dna_engine.get_brand_profile(brand_id)
    return profile

@app.get("/api/evaluation")
def get_evaluation():
    return evaluation_engine.get_evaluation_metrics()

@app.get("/api/failure-analysis")
def get_failure_analysis():
    return {
        "failure_logs": evaluation_engine.get_failure_logs(),
        "summary": {
            "total_flagged_cases": 4,
            "security_blocks": 1,
            "financial_risk_triggers": 1,
            "ambiguous_queries": 1,
            "low_evidence_tickets": 1
        }
    }

@app.get("/api/tickets")
def get_historical_tickets(
    brand_id: Optional[str] = None,
    intent: Optional[str] = None,
    emotion: Optional[str] = None,
    limit: int = 50
):
    tickets = dataset_manager.get_filtered(brand_id=brand_id, intent=intent, emotion=emotion, limit=limit)
    return {
        "total": len(tickets),
        "tickets": tickets
    }
