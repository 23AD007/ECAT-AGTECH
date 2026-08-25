# ECAT (Earth Craft AgTech)

ECAT is a full-stack agricultural marketplace that connects farmers and vendors in a single platform. It combines a React frontend, an Express backend, PostgreSQL persistence, and Python-based machine learning services for crop quality assessment, price forecasting, demand prediction, and fraud detection.

## Overview

The project is designed to simplify agricultural commerce by supporting:

- farmer crop listings and dashboard workflows
- vendor browsing, ordering, and recommendation experiences
- image-based geolocation support through EXIF metadata
- ML-assisted insights for quality, pricing, demand, and fraud monitoring

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Machine Learning: Python, Flask, scikit-learn, and TensorFlow-based models
- Infrastructure: Docker, Docker Compose, and AWS deployment assets

## Project Structure

```text
ECAT-AGTECH/
├── aws/                 # Dockerfiles and deployment assets
├── backend/             # Express API server
├── database/            # SQL schema and seed data
├── docs/                # Setup and deployment documentation
├── frontend/            # React application
├── ml_service/          # Python ML service and model code
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Docker Desktop (optional, for containerized runs)

### 1. Set up the database

Create a PostgreSQL database named `ecat_db` and load the SQL scripts:

```bash
psql -U postgres -d ecat_db -f database/schema.sql
psql -U postgres -d ecat_db -f database/seed.sql
```

### 2. Start the ML service

```bash
cd ml_service
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 3. Start the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at:

- frontend: http://localhost:3000
- backend: http://localhost:5000
- ML service: http://localhost:5001

### Docker option

```bash
docker-compose -f aws/docker-compose.yml up --build
```

## Demo Accounts

- Farmer: `farmer.john@earthcraft.com` / `password123`
- Vendor: `vendor.sarah@agrimart.com` / `password123`

## Documentation

Additional setup and deployment details are available in:

- [docs/setup_guide.md](docs/setup_guide.md)
- [aws/aws_deployment_guide.md](aws/aws_deployment_guide.md)

## License

This project is licensed under the MIT License.
