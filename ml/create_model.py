import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# create a ML model and save it as a file to reduce time
#dataset = './ml/'dataset_flights.csv
dataset = './ml/dataset.csv'
mod_file = './ml/model.pkl'
df = pd.read_csv(dataset)
label = df['delay']
df = df.drop(['delay'], axis=1)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(df, label)
with open(mod_file,'wb') as f:
    pickle.dump(model,f)