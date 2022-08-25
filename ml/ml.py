import sys
import pickle
import pandas as pd

columns = ['dep_airport', 'arr_airport', 'month', 'day_date', 'day_week', 'hour', 'duration']
data = [sys.argv[1:]]
try:
    df = pd.DataFrame(data, columns=columns)
    with open('./ml/model.pkl', 'rb') as f:
        model = pickle.load(f)
        res = model.predict(df)
        if res == 0:
            print("Normal")
        elif res == 1:
            print("Late")
        else:
            print("Delayed")
except Exception as e:
    print(e)    
sys.stdout.flush()
