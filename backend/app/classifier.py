import re
from typing import Tuple, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from app.data_loader import dataset_manager

class AIClassifierEngine:
    """Scikit-learn powered ML Classifier for Intent & Emotion detection."""
    def __init__(self):
        self.intent_pipeline = None
        self.emotion_pipeline = None
        self._train_models()

    def _train_models(self):
        df = dataset_manager.df
        X = df["customer_query"]
        y_intent = df["intent"]
        y_emotion = df["emotion"]

        # Train Intent Classifier Pipeline
        self.intent_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=2500)),
            ("clf", LogisticRegression(max_iter=500, random_state=42))
        ])
        self.intent_pipeline.fit(X, y_intent)

        # Train Emotion Classifier Pipeline
        self.emotion_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=2500)),
            ("clf", LogisticRegression(max_iter=500, random_state=42))
        ])
        self.emotion_pipeline.fit(X, y_emotion)

    def predict_intent(self, text: str) -> Tuple[str, float]:
        probs = self.intent_pipeline.predict_proba([text])[0]
        classes = self.intent_pipeline.classes_
        max_idx = probs.argmax()
        intent = str(classes[max_idx])
        confidence = float(probs[max_idx])
        return intent, round(confidence, 3)

    def predict_emotion(self, text: str) -> Tuple[str, float]:
        probs = self.emotion_pipeline.predict_proba([text])[0]
        classes = self.emotion_pipeline.classes_
        max_idx = probs.argmax()
        emotion = str(classes[max_idx])
        confidence = float(probs[max_idx])
        return emotion, round(confidence, 3)

    def calculate_urgency(self, text: str, emotion: str, intent: str) -> Tuple[int, str]:
        """Calculates SLA urgency score (1-10) and SLA classification."""
        base = 5
        text_lower = text.lower()
        
        # High urgency keywords
        urgent_keywords = ["immediately", "urgent", "stolen", "locked out", "asap", "emergency", "crash", "outage", "unauthorized", "legal", "lawsuit", "refund now"]
        matches = sum(1 for kw in urgent_keywords if kw in text_lower)
        base += matches * 2

        # Emotion weight
        if emotion in ["Angry", "Frustrated"]:
            base += 2
        elif emotion == "Anxious":
            base += 1

        # Intent weight
        if intent in ["account_lockout", "billing_dispute"]:
            base += 1
        elif intent == "technical_bug" and any(k in text_lower for k in ["crash", "500", "down"]):
            base += 2

        urgency_score = min(10, max(1, base))

        if urgency_score >= 8:
            level = "CRITICAL"
        elif urgency_score >= 6:
            level = "HIGH"
        elif urgency_score >= 4:
            level = "MEDIUM"
        else:
            level = "LOW"

        return urgency_score, level

# Global Singleton
classifier_engine = AIClassifierEngine()
