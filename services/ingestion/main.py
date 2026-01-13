from fastapi import FastAPI, Depends, HTTPException
import boto3
from uuid import uuid4
from sqlalchemy.orm import Session
from .database import SessionLocal, AssetMetadata

app = FastAPI(title="Overlord Ingestion API")

s3_client = boto3.client('s3', region_name='us-east-1')
BUCKET_NAME = "overlord-vault-master"

@app.post("/assets/upload-intent")
async def create_upload_intent(filename: str, file_type: str, artist_id: str):
    """
    Generates a presigned URL for the client to upload directly to S3.
    This minimizes server load and handles high-scale throughput.
    """
    asset_id = str(uuid4())
    object_key = f"raw/{artist_id}/{asset_id}/{filename}"
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': BUCKET_NAME, 'Key': object_key, 'ContentType': file_type},
            ExpiresIn=3600
        )
        
        # Initialize record in database
        db = SessionLocal()
        new_asset = AssetMetadata(
            id=asset_id,
            artist_id=artist_id,
            status="PRE_UPLOAD",
            original_path=object_key
        )
        db.add(new_asset)
        db.commit()
        
        return {
            "asset_id": asset_id,
            "upload_url": presigned_url,
            "object_key": object_key
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))