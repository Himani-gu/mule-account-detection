import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Data paths
RAW_DATA_PATH       = os.path.join(BASE_DIR, "data/raw/dataset.csv")
PROCESSED_DATA_PATH = os.path.join(BASE_DIR, "data/processed/features.csv")
TRAIN_PATH          = os.path.join(BASE_DIR, "data/splits/train.csv")
TEST_PATH           = os.path.join(BASE_DIR, "data/splits/test.csv")

# Model paths
MODEL_PATH  = os.path.join(BASE_DIR, "models/xgboost_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models/scaler.pkl")

# Target & seed features
TARGET = "F3924"
HINT_FEATURES = [
    "F115","F321","F527","F531","F670","F1692",
    "F2082","F2122","F2582","F2678","F2737","F2956",
    "F3043","F3836","F3887","F3889","F3891","F3894"
]

# Hyperparameters
RANDOM_STATE  = 42
TEST_SIZE     = 0.2
ALERT_THRESHOLD = 0.70