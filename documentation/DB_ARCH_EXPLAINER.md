# Database Architecture Strategy: The AI-Driven Vault

## 1. Design Philosophy
The schema is built to support the **"Vault"** (Secure, multi-version storage) and the **"Chameleon"** (Dynamic, AI-driven presentation). We use PostgreSQL with `pgvector` to avoid the overhead of a separate vector database while maintaining high performance for similarity searches.

## 2. Key Modules
- **User Metadata:** Separates authentication (`users`) from professional data (`artist_profiles`) to allow for flexible profile scaling.
- **The Vault (`artworks` & `artwork_assets`):** Implements a one-to-many relationship between an Artwork entry and its physical assets. This allows an artist to store one "Artwork" with multiple files: a PSD source, a 4K PNG, and a web-optimized thumbnail.
- **AI Intelligence:** `artwork_metadata_ai` stores structured AI insights, while `artwork_embeddings` stores the high-dimensional vectors.
- **The Chameleon Engine:** When a client brief is uploaded, we generate a `brief_embedding`. We then run a Cosine Similarity search against `artwork_embeddings` to instantly populate `smart_portfolio_items` with the artist's most relevant work.

## 3. Performance Scaling
- **HNSW Index:** Used on vector columns for lightning-fast "nearest neighbor" searches, essential for real-time portfolio generation.
- **JSONB:** Used for social links, theme configurations, and AI outputs to ensure the schema doesn't require a migration every time we add a new AI feature or social platform.
- **Partitioning Strategy (Future):** As we hit millions of artworks, we plan to partition the `artwork_embeddings` table by `artist_id` or region.

## 4. Security
- Row Level Security (RLS) should be implemented to ensure artists can only access their own `artworks` unless they are explicitly linked to a public `smart_portfolio`.