from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ml_engine.services.matching_service import PortfolioMatcher

app = FastAPI(title="Overlord ML Engine: Dynamic Personalization")
matcher = PortfolioMatcher()

class BriefRequest(BaseModel):
    artist_id: str
    brief_text: str
    max_results: Optional[int] = 12

class MatchResponse(BaseModel):
    asset_id: str
    url: str
    style: str
    confidence: float

@app.post("/match-portfolio", response_model=List[MatchResponse])
async def match_portfolio(request: BriefRequest):
    """
    Endpoint for the 'Chameleon' service to get curated assets for a custom portfolio.
    """
    try:
        matches = matcher.find_best_matches(
            artist_id=request.artist_id,
            client_brief=request.brief_text,
            limit=request.max_results
        )
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)