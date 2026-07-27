# ECAT (Earth Craft AgTech) AWS Deployment Guide

This guide outlines step-by-step instructions for deploying the ECAT full-stack application on Amazon Web Services (AWS).

---

## AWS Cloud Architecture Overview

- **Frontend**: Containerized Nginx serving React SPA deployed via AWS ECS (Elastic Container Service) or AWS Amplify / S3 + CloudFront.
- **Backend API**: Node.js Express REST API running on AWS ECS Task or AWS EC2 instance.
- **ML Microservice**: Python Flask Gunicorn container running TensorFlow & Scikit-learn models on GPU/CPU EC2 or ECS Fargate.
- **Database**: AWS RDS PostgreSQL Multi-AZ Instance.
- **Storage**: AWS S3 Bucket for high-resolution produce images with EXIF GPS metadata.

---

## Deployment Steps

### 1. Amazon RDS PostgreSQL Database Setup
1. Open the AWS RDS Console and create a new **PostgreSQL 15** instance.
2. Select Multi-AZ deployment for high availability.
3. Note your Database Host Endpoint, DB Name (`ecat_db`), Username, and Password.
4. Execute `database/schema.sql` and `database/seed.sql` using psql:
   ```bash
   psql -h <your-rds-endpoint> -U postgres -d ecat_db -f database/schema.sql
   psql -h <your-rds-endpoint> -U postgres -d ecat_db -f database/seed.sql
   ```

### 2. Container Registry (AWS ECR) Setup
Push Docker images to Elastic Container Registry:
```bash
# Login to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build & Tag Images
docker build -t ecat-backend -f aws/Dockerfile.backend backend/
docker tag ecat-backend:latest <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecat-backend:latest
docker push <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecat-backend:latest

docker build -t ecat-ml -f aws/Dockerfile.ml ml_service/
docker tag ecat-ml:latest <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecat-ml:latest
docker push <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecat-ml:latest

docker build -t ecat-frontend -f aws/Dockerfile.frontend frontend/
docker tag ecat-frontend:latest <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecat-frontend:latest
docker push <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecat-frontend:latest
```

### 3. Deploy via AWS ECS (Elastic Container Service)
1. Create an ECS Cluster (Fargate or EC2 Launch Type).
2. Register Task Definitions for `ecat-backend`, `ecat-ml`, and `ecat-frontend`.
3. Configure Application Load Balancer (ALB) listeners:
   - Port 80 / 443 &rarr; `ecat-frontend`
   - Path `/api/*` &rarr; `ecat-backend`
4. Set Environment Variables in ECS Task Definition:
   - `PGHOST`: RDS Endpoint
   - `PGDATABASE`: `ecat_db`
   - `ML_SERVICE_URL`: `http://<ecat-ml-internal-ip>:5001`

### 4. AWS S3 Bucket Setup for Produce Photos
1. Create S3 Bucket `ecat-produce-uploads-production`.
2. Configure bucket policy for public read access or signed CloudFront URLs.
