import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

dataset = './ml/dataset.csv'
df = pd.read_csv(dataset)
label = df['delay']
df = df.drop(['delay'], axis=1)
model = RandomForestClassifier(n_estimators=100)
model.fit(df, label)
with open('./ml/model.pkl','wb') as f:
    pickle.dump(model,f)