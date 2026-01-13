# Strategic Infrastructure: Global Low-Latency Access
# Deploying the platform core across multiple regions for global artists.

provider "aws" {
  alias  = "primary"
  region = "us-east-1"
}

provider "aws" {
  alias  = "europe"
  region = "eu-central-1"
}

resource "aws_dynamodb_table" "artist_metadata" {
  name           = "GlobalArtistData"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "ArtistID"
  stream_enabled = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "ArtistID"
    type = "S"
  }

  # Multi-region replication for global speed
  replica {
    region_name = "eu-central-1"
  }
  
  replica {
    region_name = "ap-southeast-1"
  }
}

resource "aws_s3_bucket" "artist_assets" {
  bucket = "overlord-standard-assets-global"
}

# CloudFront for global content delivery of portfolios
resource "aws_cloudfront_distribution" "portfolio_cdn" {
  origin {
    domain_name = aws_s3_bucket.artist_assets.bucket_regional_domain_name
    origin_id   = "S3-Assets"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Assets"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}