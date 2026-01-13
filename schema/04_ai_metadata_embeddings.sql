-- AI Analysis and Vector Data for Smart Matching
CREATE TABLE artwork_metadata_ai (
    artwork_id UUID PRIMARY KEY REFERENCES artworks(id) ON DELETE CASCADE,
    auto_tags TEXT[], -- AI generated labels
    detected_style VARCHAR(100), -- e.g., 'Cyberpunk', 'Impressionist'
    medium VARCHAR(100), -- e.g., 'Digital Painting', '3D Render'
    complexity_score FLOAT, -- 0.0 to 1.0 (AI estimated effort)
    color_palette JSONB, -- Dominant hex codes
    ai_model_version VARCHAR(100), -- The version of the model that generated this data
    last_processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Embeddings for Semantic Search (The Chameleon Engine)
-- 1536 dimensions is standard for OpenAI text-embedding-ada-002 / v3-small
-- 768 or 1024 for many Image-to-Vector models (like CLIP)
CREATE TABLE artwork_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    embedding_type VARCHAR(50) NOT NULL, -- 'visual_style', 'content_description'
    embedding vector(1536), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artwork_embedding_cosine ON artwork_embeddings 
USING hnsw (embedding vector_cosine_ops);