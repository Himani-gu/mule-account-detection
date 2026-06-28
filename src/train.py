import joblib
from xgboost import XGBClassifier
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import MODEL_PATH, RANDOM_STATE

def train_model(X_train, y_train, X_test, y_test):
    fraud = y_train.sum()
    legit = len(y_train) - fraud
    scale = legit / fraud

    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        scale_pos_weight=scale,
        use_label_encoder=False,
        eval_metric='aucpr',
        random_state=RANDOM_STATE
    )
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=50
    )
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    return model