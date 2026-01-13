-- Example Query: Find top 5 artworks matching a new client brief
-- This is the logic used to "Chameleonize" a portfolio automatically.

WITH brief_context AS (
    SELECT brief_embedding 
    FROM client_leads 
    WHERE id = 'target-lead-uuid'
)
SELECT 
    a.id, 
    a.title, 
    (e.embedding <=> (SELECT brief_embedding FROM brief_context)) AS distance
FROM 
    artworks a
JOIN 
    artwork_embeddings e ON a.id = e.artwork_id
WHERE 
    a.artist_id = 'current-artist-uuid'
    AND e.embedding_type = 'visual_style'
ORDER BY 
    distance ASC
LIMIT 5;