-- Dynamic Portfolio Generation (The Chameleon)
CREATE TABLE client_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES users(id),
    client_name VARCHAR(255),
    brief_raw_text TEXT,
    brief_analysis_json JSONB, -- Extracted keywords/requirements from AI
    brief_embedding vector(1536), -- Vector representation of what the client wants
    source_url TEXT, -- Link to job posting (LinkedIn/ArtStation)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE smart_portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES client_leads(id) ON DELETE SET NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- custom URL for the client
    custom_title VARCHAR(255),
    intro_message TEXT,
    theme_config JSONB DEFAULT '{}', -- UI customization
    view_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE smart_portfolio_items (
    portfolio_id UUID NOT NULL REFERENCES smart_portfolios(id) ON DELETE CASCADE,
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    match_reason TEXT, -- AI explanation: "Matches your request for dark sci-fi themes"
    PRIMARY KEY (portfolio_id, artwork_id)
);