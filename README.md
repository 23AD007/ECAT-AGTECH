# ECAT (Earth Craft AgTech)

**ECAT (Earth Craft AgTech)** is a full-stack agricultural marketplace platform connecting **Farmers** and **Vendors**. The platform integrates machine learning modules for produce quality detection, price prediction, demand forecasting, vendor product recommendations, and transaction fraud detection alongside real-time GPS tracking and EXIF geolocation photo uploads.

---

## 🚀 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Glassmorphism Vanilla CSS, Lucide Icons |
| **Backend** | Node.js, Express.js REST API |
| **Database** | PostgreSQL (Normalized Schema) |
| **Machine Learning** | Python, TensorFlow (CNN ResNet & LSTM), Scikit-learn (Random Forest, XGBoost, Isolation Forest) |
| **Authentication** | OAuth 2.0 / JWT, Role-Based Access Control (RBAC) |
| **Cloud / Infra** | AWS ECS/EC2, RDS PostgreSQL, S3, Docker & Docker Compose |

---

## 📁 Repository Directory Structure

```
ECAT-AGTECH/
├── database/                 # Normalized PostgreSQL SQL Scripts
│   ├── schema.sql            # Table definitions & foreign key constraints
│   └── seed.sql              # Master crops and sample user data
├── ml_service/               # TensorFlow & Scikit-learn Python Microservice
│   ├── models/
│   │   ├── quality_detector.py # TensorFlow ResNet CNN Quality Classifier
│   │   ├── price_predictor.py # Random Forest & XGBoost Price Predictor
│   │   ├── demand_forecaster.py # TensorFlow LSTM Demand Forecaster
│   │   ├── recommender.py    # Vendor Recommendation Engine
│   │   └── fraud_detector.py  # Isolation Forest Fraud Detector
│   ├── pipeline/
│   │   └── data_pipeline.py  # Data cleaning, tuning & evaluation metrics
│   ├── app.py                # Flask REST API server
│   └── requirements.txt
├── backend/                  # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/           # Database pool client
│   │   ├── controllers/      # Auth, Farmer, Vendor, Crop, Order, GPS, ML
│   │   ├── middleware/       # JWT Authentication & RBAC middleware
│   │   ├── routes/           # Express endpoint routers
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/                 # React.js SPA Application
│   ├── src/
│   │   ├── components/       # Navbar & reusable UI components
│   │   ├── context/          # AuthContext & state provider
│   │   ├── pages/            # Home, Login, Register, Tracking, Notifications
│   │   ├── pages/farmer/     # Farmer Dashboard & features
│   │   ├── pages/vendor/     # Vendor Dashboard & Marketplace
│   │   ├── services/         # API fetch wrappers
│   │   ├── App.jsx
│   │   ├── index.css         # Glassmorphism Design System
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── aws/                      # Containerized Deployment Manifests
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Dockerfile.ml
│   ├── docker-compose.yml
│   └── aws_deployment_guide.md
├── docs/                     # Comprehensive Setup Documentation
│   └── setup_guide.md
└── README.md
```

---

## ⚡ Quick Start with Docker Compose

Run the complete full stack (PostgreSQL + ML Service + Express Backend + React Frontend) with a single command:

```bash
docker-compose -f aws/docker-compose.yml up --build
```

- **React Frontend**: `http://localhost:80` (or `http://localhost:3000` for `npm run dev`)
- **Express Backend API**: `http://localhost:5000`
- **Python ML Microservice**: `http://localhost:5001`
- **PostgreSQL DB**: `localhost:5432`

---

## 🔐 Key Features & Capabilities

1. **Farmer Dashboard**:
   - Manage farm profile & organic certification details.
   - Publish crop listings with quantity, unit price, and harvest date.
   - Upload produce images with EXIF GPS metadata storage.
   - Auto-check crop quality with TensorFlow CNN ResNet model (`Fresh`, `Ripe`, `Spoiled`).
   - Run Scikit-learn Random Forest & XGBoost price predictions.
   - Negotiate order pricing with buyers.

2. **Vendor Dashboard**:
   - Search & filter available produce by category, price, and location.
   - View personalized ML crop recommendations based on past purchase history.
   - Analyze TensorFlow 7-Day LSTM regional demand sequence forecasts.
   - Place orders with escrow payment terms and fraud audit score logging.

3. **GPS Geolocation Module**:
   - EXIF metadata parsing from uploaded crop photos.
   - Continuous coordinate telemetry and live transit tracking.

4. **Data Science Pipeline**:
   - Data cleaning, feature engineering, normalization, and data augmentation.
   - Hyperparameter tuning via Grid Search & Random Search.
   - Evaluation metrics: Accuracy, Precision, Recall, Confusion Matrix, RMSE, MAE, MAPE.

---

## 📄 License
This project is licensed under the MIT License.
