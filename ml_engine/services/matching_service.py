import psycopg2
from pgvector.psycopg2 import register_vector
from ml_engine.config import Config
from ml_engine.core.embedder import engine

class PortfolioMatcher:
    def __init__(self):
        self.conn = psycopg2.connect(Config.DATABASE_URL)
        register_vector(self.conn)

    def find_best_matches(self, artist_id: str, client_brief: str, limit: int = 10):
        """
        The "Chameleon" logic: Matches a brief to an artist's specific vault items
        using cosine similarity in the vector space.
        """
        # 1. Generate embedding for the incoming brief
        query_embedding = engine.get_text_embedding(client_brief)

        with self.conn.cursor() as cur:
            # 2. Perform vector search restricted to the artist's ID
            # <-> is Euclidean distance, <=> is Cosine distance in pgvector
            search_query = """
                SELECT 
                    a.id, 
                    a.file_url, 
                    ans.primary_style,
                    1 - (ae.embedding <=> %s) AS similarity_score
                FROM assets a
                JOIN asset_embeddings ae ON a.id = ae.asset_id
                JOIN asset_analysis ans ON a.id = ans.asset_id
                WHERE a.artist_id = %s
                AND 1 - (ae.embedding <=> %s) > %s
                ORDER BY similarity_score DESC
                LIMIT %s;
            """
            cur.execute(search_query, (
                query_embedding, 
                artist_id, 
                query_embedding, 
                Config.MATCH_THRESHOLD, 
                limit
            ))
            
            results = cur.fetchall()
            
        return [
            {
                "asset_id": r[0],
                "url": r[1],
                "style": r[2],
                "confidence": float(r[3])
            } for r in results
        ]

    def close(self):
        self.conn.close()