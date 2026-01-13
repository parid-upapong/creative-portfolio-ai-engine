CREATE TABLE asset_metadata (
    id UUID PRIMARY KEY,
    artist_id UUID NOT NULL,
    status VARCHAR(20), -- PRE_UPLOAD, PROCESSING, READY, FAILED
    file_name VARCHAR(255),
    mime_type VARCHAR(50),
    file_size BIGINT,
    original_path TEXT,
    thumbnail_path TEXT,
    
    -- AI Generated Metadata
    tags JSONB, -- ['cyberpunk', 'neon', 'character-design']
    style_category VARCHAR(100),
    color_palette JSONB,
    ai_confidence_score FLOAT,
    
    -- Time Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artist_assets ON asset_metadata(artist_id);
CREATE INDEX idx_tags ON asset_metadata USING GIN (tags);