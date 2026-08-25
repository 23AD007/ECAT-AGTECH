import os
import io
from flask import Flask, request, jsonify
from flask_cors import CORS

from models.quality_detector import FoodQualityDetector
from models.price_predictor import PricePredictor
from models.demand_forecaster import DemandForecaster
from models.recommender import RecommendationEngine
from models.fraud_detector import FraudDetector
from pipeline.data_pipeline import DataSciencePipeline

app = Flask(__name__)
CORS(app)

# Initialize ML modules
quality_detector = FoodQualityDetector()
price_predictor = PricePredictor()
demand_forecaster = DemandForecaster()
recommender = RecommendationEngine()
fraud_detector = FraudDetector()
pipeline = DataSciencePipeline()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ECAT ML Service'}), 200

# 1. Food Quality Detection Endpoint
@app.route('/api/ml/quality', methods=['POST'])
def detect_quality():
    if 'image' not in request.files and not request.data:
        return jsonify({'error': 'No image file or raw data provided'}), 400
        
    try:
        if 'image' in request.files:
            file = request.files['image']
            img_bytes = file.read()
        else:
            img_bytes = request.data
            
        result = quality_detector.predict_quality(img_bytes)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 2. Price Prediction Endpoint
@app.route('/api/ml/predict-price', methods=['POST'])
def predict_price():
    data = request.get_json() or {}
    hist_price = float(data.get('historical_price', 2.50))
    demand_idx = float(data.get('demand_index', 8.0))
    harvest_days = int(data.get('harvest_days_ago', 2))
    is_organic = bool(data.get('is_organic', False))

    result = price_predictor.predict_price(hist_price, demand_idx, harvest_days, is_organic)
    return jsonify(result), 200

# 3. Demand Forecasting Endpoint
@app.route('/api/ml/demand-forecast', methods=['POST'])
def forecast_demand():
    data = request.get_json() or {}
    hist_demand = data.get('historical_demand', [7.5, 7.8, 8.0, 8.2, 8.1, 8.5, 8.7])
    temp = float(data.get('weather_temp_c', 24.0))
    rainfall = float(data.get('rainfall_mm', 5.0))

    result = demand_forecaster.forecast_demand(hist_demand, temp, rainfall)
    return jsonify(result), 200

# 4. Recommendation System Endpoint
@app.route('/api/ml/recommend', methods=['POST'])
def recommend_products():
    data = request.get_json() or {}
    vendor_id = data.get('vendor_id', 'v1111111-1111-1111-1111-111111111111')
    past_purchases = data.get('past_purchases', [])

    result = recommender.recommend_for_vendor(vendor_id, past_purchases)
    return jsonify(result), 200

# 5. Fraud Detection Endpoint
@app.route('/api/ml/detect-fraud', methods=['POST'])
def detect_fraud():
    data = request.get_json() or {}
    amount = float(data.get('amount', 1000.0))
    quantity = float(data.get('quantity', 100.0))
    expected_unit_price = float(data.get('expected_unit_price', 10.0))
    distance_km = float(data.get('distance_km', 25.0))

    result = fraud_detector.analyze_transaction(amount, quantity, expected_unit_price, distance_km)
    return jsonify(result), 200

# 6. Pipeline Metrics Endpoint
@app.route('/api/ml/pipeline-metrics', methods=['GET'])
def get_pipeline_metrics():
    # Example validation outputs from data science pipeline
    reg_metrics = pipeline.evaluate_regression([2.5, 3.0, 4.0, 2.8], [2.6, 2.9, 4.1, 2.75])
    cls_metrics = pipeline.evaluate_classification([0, 1, 0, 2, 1], [0, 1, 0, 2, 1])

    return jsonify({
        'pipeline_status': 'Active',
        'regression_metrics': reg_metrics,
        'classification_metrics': cls_metrics,
        'hyperparameter_tuning': {
            'search_methods_supported': ['Grid Search', 'Random Search'],
            'cross_validation_folds': 5
        }
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
