import numpy as np
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.data_loader import dataset_manager

class VectorSearchEngine:
    """Semantic vector search engine using TF-IDF & Cosine Similarity over historical ticket embeddings."""
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1, stop_words="english")
        self.doc_vectors = None
        self.tickets = []
        self._build_index()

    def _build_index(self):
        self.tickets = dataset_manager.get_all()
        texts = [f"{t['customer_query']} {t['intent']} {t['emotion']}" for t in self.tickets]
        self.doc_vectors = self.vectorizer.fit_transform(texts)

    def search(self, query: str, brand_id: str = None, intent: str = None, emotion: str = None, top_k: int = 5) -> List[Dict[str, Any]]:
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.doc_vectors)[0]

        matches = []
        for idx, sim in enumerate(similarities):
            t = self.tickets[idx]
            
            # Apply filters if specified
            if brand_id and t["brand_id"] != brand_id:
                continue
            if intent and t["intent"] != intent:
                continue
            if emotion and t["emotion"] != emotion:
                continue

            matches.append({
                "ticket_id": t["ticket_id"],
                "brand_id": t["brand_id"],
                "brand_name": t["brand_name"],
                "customer_query": t["customer_query"],
                "historical_resolution": t["historical_resolution"],
                "intent": t["intent"],
                "emotion": t["emotion"],
                "similarity_score": round(float(sim), 3),
                "outcome": t["outcome"],
                "csat": t["csat"],
                "resolved_by": t["resolved_by"]
            })

        # Sort by highest similarity
        matches.sort(key=lambda x: x["similarity_score"], reverse=True)
        return matches[:top_k]

# Global singleton
vector_search_engine = VectorSearchEngine()
