-- The "Vault" Core: Artworks and Versioning
CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artwork_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- 'source', 'high_res', 'thumbnail', 'web_optimized'
    file_path TEXT NOT NULL, -- S3/GCS Path
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    provider VARCHAR(50), -- 'aws_s3', 'google_cloud'
    version_label VARCHAR(50) DEFAULT '1.0',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);