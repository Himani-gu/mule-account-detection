import numpy as np
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import joblib
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import SCALER_PATH, RANDOM_STATE

def scale_and_resample(X_train, y_train, X_test):
    # Scale
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)
    joblib.dump(scaler, SCALER_PATH)
    print("Scaler saved.")

    # SMOTE to handle class imbalance
    sm = SMOTE(random_state=RANDOM_STATE)
    X_train_res, y_train_res = sm.fit_resample(X_train_scaled, y_train)
    print(f"After SMOTE — Class distribution: {dict(zip(*np.unique(y_train_res, return_counts=True)))}")

    return X_train_res, y_train_res, X_test_scaled