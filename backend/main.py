import os
import nltk
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import time
import joblib
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from pydub import AudioSegment
from tempfile import NamedTemporaryFile
import speech_recognition as sr
from fastapi.responses import JSONResponse
from fastapi.requests import Request


nltk_data_dir = os.path.join(os.getcwd(), "nltk_data")
os.makedirs(nltk_data_dir, exist_ok=True)

if nltk_data_dir not in nltk.data.path:
    nltk.data.path.append(nltk_data_dir)

for pkg in ["stopwords", "punkt", "wordnet", "omw-1.4", "punkt_tab"]:
    try:
        nltk.data.find(f"corpora/{pkg}")
    except LookupError:
        nltk.download(pkg, download_dir=nltk_data_dir)
        


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://blogproject-1-3uio.onrender.com"],
    # allow_origins=["http://localhost:5174"],
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    print("⚠️ Received preflight for:", rest_of_path)
    return JSONResponse(status_code=200, content={})

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"https\S+|www\S+http\S+", '', text)
    text = re.sub(r'@\w+|\#', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    filtered = [w for w in tokens if w not in stop_words]
    return " ".join(filtered)

model = joblib.load("best_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

@app.get("/")
def root():
    return {"msg": "Hate classification ready!"}

class TextRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict_text(request: TextRequest):
    raw_text = request.text
    processed_text = clean_text(raw_text)
    
    input_vector = vectorizer.transform([processed_text])
    predicted_label = model.predict(input_vector)[0]
    predicted_probabilities = model.predict_proba(input_vector)[0]
    
    prediction_text = "Hate Speech" if predicted_label == 1 else "Safe Speech"
    
    return {
        "cleaned_text": processed_text,
        "prediction": prediction_text,
        "probabilities": {
            "safe": float(predicted_probabilities[0]),
            "hate": float(predicted_probabilities[1])
        }
    }
        



@app.get("/ping")
def ping():
    return {"status": "ok"}