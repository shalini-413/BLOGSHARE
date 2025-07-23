import pandas as pd

df = pd.read_csv('train_refined.csv')

print("Dataset Head:")
print(df.head())

print("\nDataset Info:")
print(df.info())

print("\nLabel Distribution:")
print(df['hate_classification'].value_counts())
