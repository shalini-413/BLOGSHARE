import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

df = pd.read_csv('train_refined_cleaned.csv')
print(f"Dataset loaded with shape: {df.shape}") 

df = df.dropna(subset=['comment_text'])

vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['comment_text'])
y = df['hate_classification']
print(f"Feature matrix shape: {X.shape}") 
print(f"Target vector shape: {y.shape}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Training set shape: {X_train.shape}")
print(f"Testing set shape: {X_test.shape}")


param_grid = {
    'penalty': ['l2', 'none'],      
    'C': [0.01, 0.1, 1, 10],        
    'solver': ['newton-cg', 'lbfgs'],
    'tol': [1e-4, 1e-3]             
}

grid_search = GridSearchCV(
    LogisticRegression(max_iter=1000),
    param_grid,
    cv=5,
    scoring='accuracy',
    verbose=1,
    n_jobs=-1 
)

print("Starting GridSearchCV training...")
grid_search.fit(X_train, y_train)
print("GridSearchCV training completed.")

print(f"Best hyperparameters: {grid_search.best_params_}")
print(f"Best estimator: {grid_search.best_estimator_}")

best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, target_names=['Safe', 'Hate'])

print(f"Test Accuracy: {accuracy:.4f}")
print("Classification Report:")
print(report)




joblib.dump(best_model, 'best_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')

print("Model and vectorizer have been successfully saved.")