-- Store high-dimensional vectors for fast similarity search
CREATE TABLE asset_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    -- 512 dimensions for CLIP ViT-B/32
    embedding vector(512),
    model_version VARCHAR(50) DEFAULT 'clip-vit-b-32',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast cosine similarity searches
CREATE INDEX ON asset_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);