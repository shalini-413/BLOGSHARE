# Hate Speech Detector

This repository contains a FastAPI-based hate speech detection API that supports both text input and audio file uploads. The API preprocesses input text and uses a logistic regression model with TF-IDF features to classify the content as either "Hate" or "Safe".

## Overview

- **/predict**: Accepts a JSON payload with a `text` field. It preprocesses the text, transforms it using a TF-IDF vectorizer, and uses a trained model to predict whether the content represents hate speech.
- **/predict_audio**: Accepts an audio file (e.g., MP3, WAV, M4A), converts it to WAV format using pydub, transcribes it using SpeechRecognition with Google's API, preprocesses the transcription, and then classifies it.

## Dataset

This project uses a simplified version of train.csv file in the [Toxic Comment Classification Challenge](https://www.kaggle.com/competitions/jigsaw-toxic-comment-classification-challenge/data) dataset from Kaggle.

The original dataset contains the following columns:
- `id`: A unique identifier for each comment.
- `comment_text`: The actual text of the comment.
- `toxic`, `severe_toxic`, `obscene`, `threat`, `insult`, `identity_hate`:  
  These are six separate labels where:
  - **1** means the comment shows that trait.
  - **0** means the comment does not show that trait.

### Modified Dataset

The dataset was simplified by combining the six toxicity labels into a single binary label using a small python script.  
If any of the original labels  was marked as 1, the comment was classified as **Hate Speech**; otherwise, it was classified as **Safe Speech**.

This made it easier while still solving the problem.


## Installation

1. **Clone the repository:**

    git clone https://github.com/varun9904/hate_speech_detector.git


2. **Install dependencies:**

    Ensure you have Python installed (preferably Python 3.10 or 3.11). Then install the Python packages using:
    ```
    pip install -r requirements.txt
    ```


3. **Download NLTK Data:**

    The application automatically downloads necessary NLTK corpora (such as stopwords, punkt, wordnet, omw-1.4) on startup. No manual intervention is needed.

## Deployment

The project is configured for deployment on Render.

## Usage

- **Text Prediction Endpoint: `/predict`**

Send a POST request with JSON data:
```
curl -X POST "https://hate-speech-detector-4.onrender.com/predict" -H "Content-Type: application/json" -d "{\"text\": \"user_message\"}"
```


- **Audio Prediction Endpoint: `/predict_audio`**

Send a POST request with a file upload:
```
curl -X POST "https://hate-speech-detector-4.onrender.com/predict_audio" -F "file=@/path/to/your/audiofile.mp3"
```


## Contributing

Contributions, bug reports, and feature suggestions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

















