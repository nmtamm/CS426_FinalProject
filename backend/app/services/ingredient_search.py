import torch
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os

load_dotenv()

client = QdrantClient(
    url=os.environ.get("QDRANT_LINK"),
    api_key=os.environ.get("QDRANT_API_KEY"),
    timeout=120,
)

COLLECTION_NAME = "recipe_by_ids"

MODEL_NAME = "bkai-foundation-models/vietnamese-bi-encoder"

device = "cuda" if torch.cuda.is_available() else "cpu"
EMBEDDING_MODEL = SentenceTransformer(MODEL_NAME, device=device)


def get_embedding(text):
    embedding = EMBEDDING_MODEL.encode(text)
    return embedding.tolist()


def ingredient_search(query: str):
    user_vector = get_embedding(query)
    search_results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=user_vector,
        with_payload=True,
        limit=10,
    )

    ranked_results = []
    for result in search_results.points:
        ranked_results.append(
            {
                "ingredient_id": result.payload["ingredient_id"],
                "matched_name": result.payload["matched_name"],
                "all_synonyms": result.payload["all_synonyms"],
                "score": result.score,
            }
        )

    sorted_ranked_results = sorted(
        ranked_results, key=lambda x: x["score"], reverse=True
    )

    # Return only the ingredient_id
    return [result["ingredient_id"] for result in sorted_ranked_results]

