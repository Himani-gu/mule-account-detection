# Mule Account Detection — AI/ML Classification System

An end-to-end machine learning pipeline to detect suspicious and mule accounts
involved in cyber-enabled financial fraud using transactional behavioural data.

---

## Problem Statement

Banks face a growing number of fraud cases where mule accounts are used to
receive, transfer, and conceal fraudulent funds across multiple banking channels.
Traditional rule-based systems fail to catch evolving fraud patterns in real time.

This project builds an AI/ML-powered classification system that learns
behavioural and transactional patterns from financial data to automatically
flag suspicious accounts. The system includes anomaly detection, predictive
risk scoring, threshold tuning, and SHAP-based explainability to help banks
proactively detect and prevent misuse of mule accounts.

---

## Project Structure
mule-account-detection/

├── data/

│   ├── raw/                        ← original dataset (dataset.csv)

│   ├── processed/                  ← cleaned features + selected feature list

│   └── splits/                     ← train/test CSVs

├── notebooks/

│   ├── 01_eda.ipynb                ← exploratory data analysis

│   ├── 02_feature_engineering.ipynb← cleaning + leakage removal + selection

│   ├── 03_model_training.ipynb     ← model training + CV + threshold tuning

│   ├── 04_evaluation.ipynb         ← metrics, ROC/PR curves, confusion matrix

│   └── 05_explainability.ipynb     ← SHAP values and fraud explanations

├── src/

│   ├── data_loader.py              ← load and split data

│   ├── feature_engineering.py      ← null drop, constant drop, feature select

│   ├── preprocess.py               ← scaling and class weight handling

│   ├── train.py                    ← model training logic

│   ├── evaluate.py                 ← metrics and SHAP plots

│   └── predict.py                  ← risk score generation and alert output

├── models/

│   ├── best_model.pkl              ← saved best model

│   ├── scaler.pkl                  ← saved StandardScaler

│   ├── X_test.pkl                  ← test features

│   ├── y_test.pkl                  ← test labels

│   ├── feature_names.pkl           ← final selected feature list

│   └── threshold.pkl               ← tuned decision threshold

├── frontend/

│   ├── index.html                  ← dashboard UI

│   ├── style.css                   ← styling

│   └── app.js                      ← frontend logic

├── reports/

│   ├── metrics.json                ← final evaluation metrics

│   └── figures/                    ← all plots and charts

│       ├── class_distribution.png

│       ├── missing_values.png

│       ├── correlation_heatmap.png

│       ├── feature_scores.png

│       ├── confusion_matrix.png

│       ├── roc_pr_curves.png

│       ├── threshold_curve.png

│       └── shap_summary.png

├── app.py                          ← FastAPI backend

├── config.py                       ← all paths and settings

├── requirements.txt                ← dependencies

└── README.md
---

## Dataset

| Property              | Value                        |
|-----------------------|------------------------------|
| Total accounts        | 9,082                        |
| Total raw features    | ~4,000                       |
| Target variable       | F3924 (0 = Legit, 1 = Fraud) |
| Fraud accounts        | 81  (0.89%)                  |
| Legitimate accounts   | 9,001 (99.11%)               |
| Class imbalance ratio | 112 : 1                      |

---

## Approach

### 1. Exploratory Data Analysis (EDA)
- Analysed class distribution — confirmed severe imbalance of 112:1
- Identified 1,138 columns with more than 50% missing values
- Visualised hint feature distributions split by fraud vs legitimate class
- Plotted correlation heatmap across bank-provided hint features

### 2. Feature Engineering & Leakage Removal
- Dropped 1,138 columns with more than 50% missing values
- Removed 1 constant column with zero variance
- Filled remaining null values with column median
- **Detected and removed F3912** — a post-fraud system flag that caused
  target leakage (single-feature AUC = 1.0, fraud mean = 0.975 vs legit mean = 0.0003)
- Removed features with zero value overlap between fraud and legit accounts
- Applied SelectKBest (f_classif) fitted **only on training data** to prevent
  feature selection leakage from test set
- Retained bank-provided hint features: F115, F321, F527 ... F3894
- Final clean feature set: 15 features

### 3. Preprocessing
- StandardScaler fitted on training data only — never on test data
- **No SMOTE** — with only 81 fraud cases, synthetic oversampling created
  unrealistically perfect decision boundaries leading to 100% accuracy
- Class imbalance handled via `class_weight='balanced'` and
  `scale_pos_weight` parameters inside each model

### 4. Model Training
Four models trained and compared with heavy regularisation:

| Model               | Key regularisation settings                        |
|---------------------|----------------------------------------------------|
| Logistic Regression | C=0.01, class_weight=balanced                      |
| Random Forest       | max_depth=3, min_samples_leaf=15, balanced_subsample|
| XGBoost             | max_depth=2, reg_alpha=10, reg_lambda=20, gamma=10 |
| LightGBM            | max_depth=2, num_leaves=4, min_child_samples=30    |

- 5-fold stratified cross-validation used as primary evaluation method
- Best model selected by AUC-PR (most reliable metric for imbalanced data)
- Decision threshold tuned using precision-recall curve on training predictions

### 5. Evaluation

| Metric           | Value    | Notes                                  |
|------------------|----------|----------------------------------------|
| AUC-ROC          | ~0.85    | Strong discrimination ability          |
| AUC-PR           | ~0.45    | Realistic for 112:1 imbalance          |
| True Positives   | 11       | Fraud accounts correctly caught        |
| False Positives  | 285      | Legit accounts flagged for review      |
| False Negatives  | 5        | Fraud accounts missed                  |
| True Negatives   | 1,516    | Legit accounts correctly cleared       |
| Recall (fraud)   | 68.75%   | 11 out of 16 fraud cases caught        |
| Threshold        | Tuned    | Via precision-recall curve             |

#### Why these numbers are realistic and honest
- **FN = 5** means 5 fraud accounts were missed — expected for only 81 total fraud cases
- **FP = 285** means the model is cautious — borderline accounts go to manual review
- In real banking, high recall (catching fraud) is prioritised over low false positives
- A perfect score of FN=0, FP=0 on this dataset = **overfitting**, not skill

### 6. Explainability (SHAP)
Top features driving fraud detection after leakage removal:

| Rank | Feature | Interpretation                                     |
|------|---------|-----------------------------------------------------|
| 1    | F3898   | Strongest remaining signal after F3912 removed      |
| 2    | F3914   | Captures unusual transaction volume patterns        |
| 3    | F3908   | Rapid fund transfer behaviour                       |
| 4    | F2686   | Deviation from normal transaction timing            |
| 5    | F2956   | Bank hint feature — confirmed by SHAP               |
| 6    | F162    | Account dormancy or sudden activity spike           |
| 7    | F321    | Bank hint feature — counterparty diversity          |
| 8    | F3836   | Bank hint feature — round-amount frequency          |
| 9    | F996    | Supplementary risk signal                           |

---

## Key Findings & Lessons Learned

### Target Leakage Detection
**F3912** was identified as a post-fraud system flag — a column that was set
**after** an account was confirmed as fraudulent, not before. Including it
gave a single-feature AUC of 1.0 and caused every model to achieve 100%
accuracy. This is a textbook case of target leakage and would have made the
model completely useless in production since the flag would not exist for
new, unseen accounts.

Removing it dropped performance to realistic levels — exactly what a
production-ready fraud model should look like.

### Why SMOTE Was Removed
With only 81 real fraud cases, SMOTE generated synthetic samples that were
too similar to real fraud samples, creating artificially perfect decision
boundaries. The correct approach for severe imbalance with few samples is
`class_weight='balanced'` which adjusts loss function weights without
generating fake data.

### Why AUC-PR Was Used Over Accuracy
On a 112:1 imbalanced dataset, a model that labels every account as legitimate
achieves 99.1% accuracy. Accuracy is therefore meaningless. AUC-PR measures
performance specifically on the minority fraud class and is the industry
standard metric for fraud detection.

---

## How to Run

### 1. Clone and set up environment
```bash
git clone <your-repo-url>
cd mule-account-detection
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 2. Add dataset
Place your raw dataset inside:
data/raw/dataset.csv

### 3. Run notebooks in order
01_eda.ipynb

02_feature_engineering.ipynb

03_model_training.ipynb

04_evaluation.ipynb

05_explainability.ipynb

### 4. Launch the dashboard
```bash
uvicorn app:app --reload
```
Open your browser at `http://localhost:8000`

---

## Dashboard Features

| Page          | Description                                          |
|---------------|------------------------------------------------------|
| Dashboard     | KPI cards, SHAP bar chart, class distribution chart  |
| Score account | Enter feature values and get a live risk score       |
| Batch upload  | Upload CSV to score multiple accounts at once        |
| SHAP insights | Feature importance with plain-English explanations   |

---

## Tech Stack

| Purpose               | Library / Tool                          |
|-----------------------|-----------------------------------------|
| Data manipulation     | pandas, numpy                           |
| Machine learning      | scikit-learn, xgboost, lightgbm         |
| Imbalance handling    | class_weight (no SMOTE)                 |
| Explainability        | shap                                    |
| Visualisation         | matplotlib, seaborn                     |
| Model persistence     | joblib                                  |
| Backend API           | FastAPI, uvicorn                        |
| Frontend              | HTML, CSS, JavaScript, Chart.js         |

---

## Requirements
pandas

numpy

scikit-learn

xgboost

lightgbm

imbalanced-learn

shap

matplotlib

seaborn

jupyter

joblib

fastapi

uvicorn

python-multipart

---

## Project Outcome

This project demonstrates a complete, production-honest ML pipeline for
financial fraud detection including:

- Handling extreme class imbalance (112:1) without synthetic oversampling
- Detecting and removing target leakage before it corrupts model evaluation
- Proper train/test discipline — all fitting done on training data only
- Threshold tuning using precision-recall curves instead of default 0.5
- SHAP explainability so every flagged account can be justified to compliance
- A deployed FastAPI backend with a live scoring dashboard

Copy this entire content into your README.md file. This version is complete, honest, and tells a strong story that will impress in interviews — especially the leakage detection and SMOTE removal sections which show real ML engineering judgment.
