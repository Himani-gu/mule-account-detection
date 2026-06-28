import json, os
import numpy as np
import matplotlib.pyplot as plt
import shap
from sklearn.metrics import (
    classification_report, roc_auc_score,
    average_precision_score, confusion_matrix, ConfusionMatrixDisplay
)
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import BASE_DIR

def evaluate_model(model, X_test, y_test, feature_names):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    auc_roc = roc_auc_score(y_test, y_prob)
    auc_pr  = average_precision_score(y_test, y_prob)

    print(classification_report(y_test, y_pred))
    print(f"AUC-ROC : {auc_roc:.4f}")
    print(f"AUC-PR  : {auc_pr:.4f}")

    # Save metrics
    metrics = {"AUC_ROC": auc_roc, "AUC_PR": auc_pr}
    with open(os.path.join(BASE_DIR, "reports/metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(cm)
    disp.plot()
    plt.savefig(os.path.join(BASE_DIR, "reports/figures/confusion_matrix.png"))
    plt.close()

    # SHAP summary plot
    explainer   = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    shap.summary_plot(shap_values, X_test, feature_names=feature_names, show=False)
    plt.savefig(os.path.join(BASE_DIR, "reports/figures/shap_summary.png"), bbox_inches='tight')
    plt.close()
    print("Plots saved to reports/figures/")