import numpy as np
from sklearn.ensemble import IsolationForest

class FraudDetector:
    """
    Fraud Detection Module using Isolation Forest.
    Analyzes transaction values, quantity, frequency, and location anomalies to flag fraud.
    """

    def __init__(self):
        self.clf = IsolationForest(contamination=0.1, random_state=42)
        self._train_baseline()

    def _train_baseline(self):
        """Train Isolation Forest on normal baseline transactions."""
        # Features: [amount, quantity, price_deviation_ratio, geo_distance_km]
        X_normal = np.array([
            [500, 200, 1.0, 15],
            [1200, 450, 0.98, 30],
            [3400, 1200, 1.02, 50],
            [280, 100, 1.05, 5],
            [15000, 5000, 0.95, 120],
            [800, 300, 1.01, 20]
        ])
        self.clf.fit(X_normal)

    def analyze_transaction(self, amount: float, quantity: float, expected_unit_price: float, distance_km: float = 10.0) -> dict:
        """Analyze transaction for fraud anomalies."""
        unit_price = amount / (quantity + 1e-5)
        price_dev = unit_price / (expected_unit_price + 1e-5)

        input_feat = np.array([[amount, quantity, price_dev, distance_km]])
        
        # Anomaly score (-1 for anomaly, 1 for normal)
        prediction = self.clf.predict(input_feat)[0]
        score = self.clf.decision_function(input_feat)[0]
        
        # Normalize risk score between 0.0 (safe) and 1.0 (fraudulent)
        risk_score = round(float(np.clip(0.5 - (score * 0.5), 0.0, 1.0)), 4)
        
        # Rule-based triggers for extreme anomalies
        is_flagged = False
        reasons = []

        if price_dev > 3.0 or price_dev < 0.2:
            is_flagged = True
            risk_score = max(risk_score, 0.85)
            reasons.append("Extreme price deviation from market average")

        if amount > 100000 and distance_km > 500:
            is_flagged = True
            risk_score = max(risk_score, 0.92)
            reasons.append("Unusual high-value transaction over long distance")

        if prediction == -1:
            is_flagged = True
            reasons.append("Statistical anomaly detected by Isolation Forest")

        return {
            'is_flagged_fraud': is_flagged,
            'fraud_risk_score': risk_score,
            'risk_level': 'HIGH' if risk_score > 0.7 else ('MEDIUM' if risk_score > 0.4 else 'LOW'),
            'audit_reasons': reasons if reasons else ['Transaction matches normal pattern']
        }
