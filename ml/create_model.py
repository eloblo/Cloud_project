import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
import pickle

dataset = './ml/dataset.csv'
mod_file = './ml/model.pkl'
df = pd.read_csv(dataset)
label = df['delay']
df = df.drop(['delay'], axis=1)
model = GradientBoostingClassifier(n_estimators=300, learning_rate=0.1, random_state=42, max_depth=5)
model.fit(df, label)
with open(mod_file,'wb') as f:
    pickle.dump(model,f)