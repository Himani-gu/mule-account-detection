import pandas as pd
from sklearn.model_selection import train_test_split
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import RAW_DATA_PATH, TRAIN_PATH, TEST_PATH, TARGET, RANDOM_STATE, TEST_SIZE

def load_raw_data():
    df = pd.read_csv(RAW_DATA_PATH)
    print(f"Dataset shape: {df.shape}")
    print(f"\nTarget distribution:\n{df[TARGET].value_counts()}")
    return df

def save_splits(df):
    X = df.drop(columns=[TARGET])
    y = df[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, stratify=y, random_state=RANDOM_STATE
    )
    train = X_train.copy(); train[TARGET] = y_train
    test  = X_test.copy();  test[TARGET]  = y_test
    train.to_csv(TRAIN_PATH, index=False)
    test.to_csv(TEST_PATH,   index=False)
    print(f"Train: {train.shape}, Test: {test.shape}")
    return X_train, X_test, y_train, y_test