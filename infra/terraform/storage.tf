# Infrastructure as Code for Multi-Cloud Resilience
resource "aws_s3_bucket" "vault_master" {
  bucket = "overlord-vault-master"
  tags = {
    Environment = "Production"
    Service     = "Vault"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "vault_lifecycle" {
  bucket = aws_s3_bucket.vault_master.id

  rule {
    id      = "archive_old_versions"
    status  = "Enabled"

    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}

# Cross-region replication for High Availability
resource "aws_s3_bucket_replication_configuration" "replication" {
  role   = aws_iam_role.replication.arn
  bucket = aws_s3_bucket.vault_master.id

  rule {
    id     = "backup_to_west"
    status = "Enabled"

    destination {
      bucket        = aws_s3_bucket.vault_backup_west.arn
      storage_class = "STANDARD"
    }
  }
}