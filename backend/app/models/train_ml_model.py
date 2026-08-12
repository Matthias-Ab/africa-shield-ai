"""Trains the ML "second opinion" flood risk model and saves it to
ml_risk_model.pkl. Run this file directly to (re)train:

    cd backend
    .venv/Scripts/python.exe -m app.models.train_ml_model    (Windows)
    .venv/bin/python -m app.models.train_ml_model             (macOS/Linux)

# TODO: this trains on SYNTHETIC data (generated below), not real
# historical flood records. A genuine future upgrade is retraining on
# real historical rainfall/river-level/flood-outcome data (e.g. from
# NASA/ESA satellite archives or national meteorological services) —
# swap out `generate_synthetic_training_data()` for a real dataset
# loader and everything downstream (the Pipeline, the save step) stays
# the same.

Why logistic regression: it's a simple, well-understood classifier — the
whole model is just a learned linear boundary (after standardizing the
two inputs) between low/medium/high, which is easy to describe to a judge
in one sentence, unlike a deep net or an ensemble of trees.
"""

import pickle
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from app.models.risk_model import (
    HIGH_THRESHOLD,
    MEDIUM_THRESHOLD,
    RAINFALL_CAP_MM,
    RIVER_LEVEL_CAP_M,
    compute_risk,
)

MODEL_FILE = Path(__file__).resolve().parent / "ml_risk_model.pkl"

N_SAMPLES = 2000
RANDOM_SEED = 42

# Wider than the rules-based caps (100mm / 4m) so the model also sees
# some extreme/out-of-range inputs during training, not just the exact
# range the rules-based formula was tuned against.
RAINFALL_RANGE_MM = (0.0, 120.0)
RIVER_LEVEL_RANGE_M = (0.0, 4.5)


def generate_synthetic_training_data(n_samples: int = N_SAMPLES, seed: int = RANDOM_SEED):
    """Synthetic (rainfall, river_level) -> risk_level training data.

    This is deliberately NOT a 1:1 re-encoding of the rules-based formula
    in risk_model.py — it uses different feature weights (55/45 instead
    of 50/50), adds a compounding interaction term (rainfall AND high
    river level together is worse than either alone), and injects
    Gaussian noise before bucketing. That means the ML model learns a
    genuinely different decision boundary and will sometimes disagree
    with the rules-based score on borderline cases — which is the point
    of showing both as a "second opinion," not a restatement of the same
    number twice.

    The high/medium thresholds are still borrowed from risk_model.py so
    "what counts as high" is anchored to the same real-world definition
    the team already agreed on, rather than an arbitrary new cutoff.
    """
    rng = np.random.default_rng(seed)

    rainfall = rng.uniform(*RAINFALL_RANGE_MM, size=n_samples)
    river_level = rng.uniform(*RIVER_LEVEL_RANGE_M, size=n_samples)

    normalized_rainfall = np.clip(rainfall / RAINFALL_CAP_MM, 0.0, 1.0)
    normalized_river = np.clip(river_level / RIVER_LEVEL_CAP_M, 0.0, 1.0)

    interaction = normalized_rainfall * normalized_river
    noise = rng.normal(loc=0.0, scale=0.06, size=n_samples)

    latent_severity = np.clip(
        0.55 * normalized_rainfall + 0.45 * normalized_river + 0.10 * interaction + noise,
        0.0,
        1.0,
    )

    labels = np.where(
        latent_severity >= HIGH_THRESHOLD,
        "high",
        np.where(latent_severity >= MEDIUM_THRESHOLD, "medium", "low"),
    )

    X = np.column_stack([rainfall, river_level])
    return X, labels, latent_severity


def train_and_save() -> None:
    X, y, _ = generate_synthetic_training_data()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y
    )

    pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            ("classifier", LogisticRegression(max_iter=1000, random_state=RANDOM_SEED)),
        ]
    )
    pipeline.fit(X_train, y_train)

    test_accuracy = pipeline.score(X_test, y_test)

    # How often the ML model's predicted bucket differs from what the
    # deterministic rules-based formula would say for the exact same
    # inputs — evidence this is a genuine "second opinion," not the same
    # formula wearing a different hat.
    rules_labels = np.array([compute_risk(r, l)[0] for r, l in X_test])
    ml_labels = pipeline.predict(X_test)
    disagreement_rate = float(np.mean(rules_labels != ml_labels))

    print(f"Trained on {len(X_train)} samples, tested on {len(X_test)}.")
    print(f"Test accuracy (vs. synthetic ground truth): {test_accuracy:.2%}")
    print(f"Disagreement rate vs. rules-based formula on test inputs: {disagreement_rate:.2%}")

    with open(MODEL_FILE, "wb") as f:
        pickle.dump(pipeline, f)
    print(f"Saved model to {MODEL_FILE}")


if __name__ == "__main__":
    train_and_save()
