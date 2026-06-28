import pandas as pd
import numpy as np
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import HINT_FEATURES, TARGET, PROCESSED_DATA_PATH

def engineer_features(df):
    df = df.copy()

    # Drop columns with more than 50% missing values
    thresh = len(df) * 0.5
    df = df.dropna(axis=1, thresh=thresh)
    print(f"Shape after dropping high-null columns: {df.shape}")

    # Fill remaining nulls with median
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if TARGET in num_cols:
        num_cols.remove(TARGET)
    df[num_cols] = df[num_cols].fillna(df[num_cols].median())

    # Keep hint features that still exist after dropping
    available_hints = [f for f in HINT_FEATURES if f in df.columns]
    print(f"Available hint features: {len(available_hints)} / {len(HINT_FEATURES)}")

    # Save processed data
    df.to_csv(PROCESSED_DATA_PATH, index=False)
    print(f"Processed data saved to {PROCESSED_DATA_PATH}")
    return df

def get_feature_columns(df):
    cols = [c for c in df.columns if c != TARGET]
    return cols