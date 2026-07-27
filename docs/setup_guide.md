# ECAT (Earth Craft AgTech) Local Setup & Execution Guide

Follow these steps to run the complete ECAT agricultural marketplace on your local machine.

---

## Prerequisites
- **Node.js**: v18+ and npm
- **Python**: v3.9+ and pip
- **PostgreSQL**: v14+ (or Docker)

---

## Step-by-Step Installation

### 1. Database Setup
1. Create a PostgreSQL database named `ecat_db`.
2. Execute the schema and seed scripts:
```bash
psql -U postgres -d ecat_db -f database/schema.sql
psql -U postgres -d ecat_db -f database/seed.sql
```

### 2. Python ML Microservice Setup
1. Open terminal in `ml_service/`:
```bash
cd ml_service
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*The ML service will start on `http://localhost:5001`.*

### 3. Node.js Express Backend Setup
1. Open a new terminal in `backend/`:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
*The backend REST API server will start on `http://localhost:5000`.*

### 4. React.js Frontend Setup
1. Open a new terminal in `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
*The React application will be available at `http://localhost:3000`.*

---

## Pre-loaded Demo Accounts

- **Farmer Account**:
  - Email: `farmer.john@earthcraft.com`
  - Password: `password123`
- **Vendor Account**:
  - Email: `vendor.sarah@agrimart.com`
  - Password: `password123`
