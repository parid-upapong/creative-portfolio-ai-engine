-- Extend the schema to store AI-generated insights
CREATE TABLE asset_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Aesthetic & Style Analysis
    primary_style VARCHAR(100), -- e.g., "Cyberpunk", "Impressionism", "Low Poly"
    medium VARCHAR(100),        -- e.g., "Digital 2D", "3D Render", "Oil on Canvas"
    mood_tags TEXT[],           -- e.g., ["gloomy", "vibrant", "energetic"]
    
    -- Visual Features
    color_palette JSONB,        -- Store dominant hex codes and weights
    composition_score FLOAT,    -- AI's heuristic on rule-of-thirds, etc.
    
    -- Content & Semantic Search
    tags JSONB,                 -- Label: Confidence (e.g., {"character": 0.98, "sword": 0.85})
    embedding vector(512),      -- CLIP ViT-B/32 embedding for "The Chameleon" matching
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_embedding ON asset_analysis USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_asset_tags ON asset_analysis USING gin (tags);