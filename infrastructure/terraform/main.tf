# Provider configuration for AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 Bucket for the "Vault" (Artist Assets)
resource "aws_s3_bucket" "vault_assets" {
  bucket = "overlord-vault-assets-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "vault_access" {
  bucket = aws_s3_bucket.vault_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# RDS instance for PostgreSQL with pgvector support
resource "aws_db_instance" "overlord_db" {
  allocated_storage    = 100
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = "db.t3.large"
  db_name              = "overlord"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

# EKS Cluster for Orchestration
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "overlord-cluster-${var.environment}"
  cluster_version = "1.27"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      instance_types = ["t3.medium"]
      min_size     = 2
      max_size     = 5
    }
    # GPU Node Group for ML Engine (Chameleon Strategy)
    ml_gpu = {
      instance_types = ["g4dn.xlarge"]
      min_size     = 1
      max_size     = 3
      labels = {
        workload = "ml-inference"
      }
    }
  }
}