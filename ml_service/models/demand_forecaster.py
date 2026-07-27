import numpy as np

class DemandForecaster:
    """
    Demand Forecasting Model using TensorFlow LSTM.
    Predicts future crop demand based on historical demand sequences and weather inputs.
    """

    def __init__(self):
        self._model = None
        self._build_or_load_model()

    def _build_or_load_model(self):
        """Construct TensorFlow LSTM architecture for time series demand forecasting."""
        try:
            import tensorflow as tf
            from tensorflow.keras import layers, models

            model = models.Sequential([
                layers.LSTM(64, activation='relu', input_shape=(7, 3), return_sequences=False),
                layers.Dropout(0.2),
                layers.Dense(32, activation='relu'),
                layers.Dense(7) # Predict next 7 days demand index (0 - 10 scale)
            ])
            model.compile(optimizer='adam', loss='mse')
            self._model = model
        except Exception as e:
            print(f"Warning: TensorFlow LSTM compilation fallback mode active: {e}")

    def forecast_demand(self, historical_demand: list, weather_temp_c: float = 24.0, rainfall_mm: float = 5.0) -> dict:
        """Forecast demand for the upcoming 7 days."""
        # Ensure 7 timestep history
        if not historical_demand or len(historical_demand) < 7:
            historical_demand = [7.5, 7.8, 8.0, 8.2, 8.1, 8.5, 8.7]
        else:
            historical_demand = historical_demand[-7:]

        # Reshape input: (1, 7, 3) -> [demand, temp, rainfall]
        seq_input = np.zeros((1, 7, 3), dtype=np.float32)
        for i in range(7):
            seq_input[0, i, 0] = historical_demand[i]
            seq_input[0, i, 1] = weather_temp_c
            seq_input[0, i, 2] = rainfall_mm

        if self._model is not None:
            preds = self._model.predict(seq_input, verbose=0)[0]
            forecast_list = [round(float(np.clip(p, 0.0, 10.0)), 2) for p in preds]
        else:
            # Mathematical trend sequence fallback
            last_val = historical_demand[-1]
            trend = (historical_demand[-1] - historical_demand[0]) / 7.0
            forecast_list = [round(float(np.clip(last_val + (i + 1) * trend + np.random.normal(0, 0.1), 1.0, 10.0)), 2) for i in range(7)]

        return {
            'historical_7_days': historical_demand,
            'forecast_next_7_days': forecast_list,
            'avg_forecasted_demand': round(float(np.mean(forecast_list)), 2),
            'demand_trend': 'HIGH_GROWTH' if forecast_list[-1] > forecast_list[0] else 'STABLE'
        }
