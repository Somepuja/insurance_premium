from fastapi import FastAPI
from fastapi.responses import JSONResponse
from schema.user_input import UserInput
from schema.prediction_response import PredictionResponse
from model.predict import predict_output, model,model_version

app = FastAPI()
        
@app.get('/')
def home():
    return {"message": "Welcome to the insurance premium prediction API"}

@app.get('/health')
def health_check():
    return {
        "status": "Ok",
        "version": model_version,
        "model_loaded": model is not None
        }

@app.post('/predict', response_model=PredictionResponse)
def predict_premium(data: UserInput):
    user_input = {
        'income_lpa': data.income_lpa,
        'occupation': data.occuption,
        'bmi': data.bmi,
        'age_group': data.age_group,
        'lifestyle_risk': data.lifestyle_risk,
        'city_tier': data.city_tier
    }
    try:
        prediction = predict_output(user_input)
        return JSONResponse(status_code=200,content={"insurance_premium_category": prediction})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})