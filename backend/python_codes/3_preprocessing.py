import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"https\S+|www\S+http\S+", '', text)
    text = re.sub(r'@\w+|\#', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    filtered = [w for w in tokens if w not in stop_words]
    return " ".join(filtered)

import pandas as pd
df = pd.read_csv('train_refined.csv')
df['comment_text'] = df['comment_text'].apply(clean_text)
print("Cleaned Text Preview:")
print(df['comment_text'].head())

df = df.drop_duplicates('comment_text')
print("\nDataset after removing duplicates:")
print(df.info())

df.to_csv('train_refined_cleaned.csv', index=False)
