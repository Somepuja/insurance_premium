import pickle 
import pandas as pd 
import os

## import the ml model
with open(os.path.join("..", "model", "model.pkl"), "rb") as f:
    model = pickle.load(f)

model_version = '1.0.0'

def predict_output(user_input: dict):
    input_df = pd.DataFrame([user_input])
    output = model.predict(input_df)[0]
    return output
