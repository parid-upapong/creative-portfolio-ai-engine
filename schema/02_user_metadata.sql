-- Core User and Artist Profiles
CREATE TYPE user_tier AS ENUM ('free', 'pro', 'enterprise');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tier user_tier DEFAULT 'free',
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE artist_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    bio TEXT,
    website_url TEXT,
    social_links JSONB DEFAULT '{}', -- { "instagram": "...", "artstation": "..." }
    base_currency CHAR(3) DEFAULT 'USD',
    min_project_rate DECIMAL(12, 2),
    skills TEXT[], -- Array of manual skills
    availability_status VARCHAR(50) DEFAULT 'available',
    global_settings JSONB DEFAULT '{
        "auto_watermark": true,
        "ai_tagging_enabled": true,
        "primary_storage": "s3"
    }'
);