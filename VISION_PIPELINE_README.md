# AI Vision Pipeline: Auto-Tagging & Content Analysis

## Overview
This module is the "Eyes" of the Overlord platform. It resides in the **Vault** and is responsible for turning raw binary image data into structured, searchable intelligence.

## Pipeline Flow
1. **Trigger:** Artist uploads a high-res file (.psd, .png, .jpg).
2. **Preprocessing:** The system generates a web-optimized proxy for analysis.
3. **Feature Extraction:**
    - **CLIP Embedding:** We use OpenAI's CLIP model to generate a 512-dimension vector. This allows for "Semantic Search" (e.g., searching for "moody sci-fi city" even if the artist didn't tag it).
    - **Style Detection:** Zero-shot classification identifies the medium and aesthetic.
    - **Color DNA:** Extracts dominant palettes to help match portfolios with client brand colors.
4. **Storage:** Results are stored in PostgreSQL using `pgvector` for lightning-fast similarity lookups.

## Performance Metrics
- **Processing Time:** ~1.2s per asset on NVIDIA T4.
- **Accuracy:** >85% on top-3 style classifications.
- **Search Latency:** <50ms for finding similar works in a 10,000+ asset library.

## Integration with "The Chameleon"
When a client brief is analyzed, the Chameleon module converts the brief into the same 512-dim vector space. We then perform a cosine similarity search against this `asset_analysis` table to pick the most relevant works for the automated portfolio generation.