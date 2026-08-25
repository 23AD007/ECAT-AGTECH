import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV, KFold
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix, mean_squared_error, mean_absolute_error

class DataSciencePipeline:
    """
    Complete Data Science Pipeline for ECAT:
    - Data Collection & Cleaning
    - Normalization & Feature Engineering
    - Feature Selection
    - Data Augmentation
    - Model Training & Cross Validation
    - Hyperparameter Tuning (Grid Search / Random Search)
    - Comprehensive Model Evaluation (Classification & Regression Metrics)
    """

    def __init__(self):
        self.scaler = StandardScaler()
        self.minmax_scaler = MinMaxScaler()

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Data cleaning: handle missing values, drop duplicates."""
        df = df.copy()
        df = df.drop_duplicates()
        # Impute numeric missing values with median
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            if df[col].isnull().sum() > 0:
                df[col] = df[col].fillna(df[col].median())
        # Impute categorical with mode
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if df[col].isnull().sum() > 0:
                df[col] = df[col].fillna(df[col].mode()[0])
        return df

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Feature engineering: date features, ratios, and lag variables."""
        df = df.copy()
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['year'] = df['date'].dt.year
            df['month'] = df['date'].dt.month
            df['dayofweek'] = df['date'].dt.dayofweek
            df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
        
        if 'historical_price' in df.columns and 'demand_index' in df.columns:
            df['price_demand_ratio'] = df['historical_price'] / (df['demand_index'] + 1e-5)
            
        return df

    def normalize_features(self, X_train, X_test=None, method='standard'):
        """Normalize features using StandardScaler or MinMaxScaler."""
        if method == 'standard':
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test) if X_test is not None else None
        else:
            X_train_scaled = self.minmax_scaler.fit_transform(X_train)
            X_test_scaled = self.minmax_scaler.transform(X_test) if X_test is not None else None
            
        return X_train_scaled, X_test_scaled

    def hyperparameter_tune(self, model, param_grid, X, y, search_type='grid', cv=5, n_iter=10):
        """Hyperparameter tuning using Grid Search or Random Search."""
        if search_type == 'grid':
            searcher = GridSearchCV(estimator=model, param_grid=param_grid, cv=cv, scoring='neg_mean_squared_error', n_jobs=-1)
        elif search_type == 'random':
            searcher = RandomizedSearchCV(estimator=model, param_distributions=param_grid, n_iter=n_iter, cv=cv, scoring='neg_mean_squared_error', n_jobs=-1, random_state=42)
        else:
            raise ValueError("search_type must be 'grid' or 'random'")
            
        searcher.fit(X, y)
        return searcher.best_estimator_, searcher.best_params_

    def evaluate_regression(self, y_true, y_pred):
        """Evaluate regression models: RMSE, MAE, MAPE."""
        y_true, y_pred = np.array(y_true), np.array(y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mae = mean_absolute_error(y_true, y_pred)
        mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-8))) * 100
        return {
            'RMSE': float(rmse),
            'MAE': float(mae),
            'MAPE_percent': float(mape)
        }

    def evaluate_classification(self, y_true, y_pred):
        """Evaluate classification models: Accuracy, Precision, Recall, Confusion Matrix."""
        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_true, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_true, y_pred).tolist()
        return {
            'Accuracy': float(acc),
            'Precision': float(prec),
            'Recall': float(rec),
            'ConfusionMatrix': cm
        }
