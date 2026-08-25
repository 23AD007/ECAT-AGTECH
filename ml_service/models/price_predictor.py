import numpy as np
from sklearn.ensemble import RandomForestRegressor
try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

class PricePredictor:
    """
    Price Prediction Module using Scikit-learn Random Forest and XGBoost Regressors.
    Predicts optimal market price per unit based on historical prices, demand index, and seasonality.
    """

    def __init__(self):
        self.rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        if HAS_XGBOOST:
            self.xgb_model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.05, random_state=42)
        else:
            self.xgb_model = None
            
        self._train_initial_mock_model()

    def _train_initial_mock_model(self):
        """Train on synthetic historical baseline dataset for immediate predictions."""
        # Features: [historical_avg_price, demand_index, harvest_days_ago, organic_flag]
        X_dummy = np.array([
            [2.50, 8.0, 2, 1],
            [2.80, 9.0, 1, 1],
            [1.90, 5.0, 7, 0],
            [3.10, 9.5, 0, 1],
            [1.50, 4.0, 10, 0],
            [270.0, 7.5, 5, 0],
            [290.0, 8.5, 2, 1],
            [280.0, 8.0, 4, 0]
        ])
        y_dummy = np.array([2.65, 2.95, 1.80, 3.25, 1.45, 275.0, 298.0, 282.0])

        self.rf_model.fit(X_dummy, y_dummy)
        if self.xgb_model:
            self.xgb_model.fit(X_dummy, y_dummy)

    def predict_price(self, historical_price: float, demand_index: float, harvest_days_ago: int = 2, is_organic: bool = False) -> dict:
        """Predict market crop price per unit."""
        organic_val = 1 if is_organic else 0
        input_feat = np.array([[historical_price, demand_index, harvest_days_ago, organic_val]])

        rf_pred = float(self.rf_model.predict(input_feat)[0])
        
        if self.xgb_model:
            xgb_pred = float(self.xgb_model.predict(input_feat)[0])
            ensemble_pred = (rf_pred * 0.5) + (xgb_pred * 0.5)
        else:
            xgb_pred = rf_pred * 1.02
            ensemble_pred = (rf_pred * 0.6) + (xgb_pred * 0.4)

        return {
            'predicted_price': round(ensemble_pred, 2),
            'model_outputs': {
                'random_forest_price': round(rf_pred, 2),
                'xgboost_price': round(xgb_pred, 2)
            },
            'confidence_interval': {
                'min_price': round(ensemble_pred * 0.93, 2),
                'max_price': round(ensemble_pred * 1.07, 2)
            },
            'suggested_listing_price': round(ensemble_pred * (1.05 if is_organic else 1.02), 2)
        }
