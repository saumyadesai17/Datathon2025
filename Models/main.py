from fastapi import FastAPI, HTTPException
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import glob
import os
from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
from geopy.geocoders import Nominatim

class MenuRecommendation(BaseModel):
    menu_id: int
    menu_name: str
    similarity_score: float

# Updated response model to include menu details
class RecommendationResponse(BaseModel):
    user_id: int
    recommended_items: List[MenuRecommendation]

class RecommendationRequest(BaseModel):
    user_id: int
    num_recommendations: Optional[int] = 5

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this for security in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load all models and scalers
models = {
    "andheri": ("andheri.pkl", "scaler.pkl"),
    "dadar": ("dadar.pkl", "scaler2.pkl"),
    "borivali": ("borivali.pkl", "scaler3.pkl"),
    "bhayander": ("bhayander.pkl", "scaler4.pkl"),
}
def generate_forecast(model_file, scaler_file):
    """Generates a 30-day forecast using the given model and scaler."""
    model = joblib.load(model_file)
    scaler = joblib.load(scaler_file)

    last_date = datetime.today()
    forecast_dates = pd.date_range(start=last_date + timedelta(days=1), periods=30, freq='D')

    # Generate features for prediction
    future_features = pd.DataFrame({
        'dayofweek': forecast_dates.dayofweek,
        'month': forecast_dates.month,
        'year': forecast_dates.year,
        'day': forecast_dates.day,
        'is_weekend': (forecast_dates.dayofweek >= 5).astype(int),
        'is_month_start': forecast_dates.is_month_start.astype(int),
        'is_month_end': forecast_dates.is_month_end.astype(int)
    }, index=forecast_dates)

    # Scale features and predict
    X_future_scaled = scaler.transform(future_features)
    predictions = model.predict(X_future_scaled)

    # Format the result
    return {date.strftime('%Y-%m-%d'): float(pred) for date, pred in zip(forecast_dates, predictions)}


class RecommenderSystem:
    def __init__(self):
        self.df = None
        self.model = None
        self.user_item_matrix = None
        self.scaler = StandardScaler()
        
    def load_data(self, data_path: str):
        data_path = os.path.abspath("Data")  # Use absolute path
        print(f"Looking for CSV files in: {data_path}")
        # Load all CSV files from the directory
        csv_files = glob.glob(os.path.join(data_path, "*.csv"))
        print("Loading CSV files", csv_files)
        dfs = []
        
        for file in csv_files:
            df = pd.read_csv(file)
            dfs.append(df)
        
        # Merge all dataframes
        self.df = pd.concat(dfs, ignore_index=True)
        
        # Process Order_List column: only evaluate if the value is a string
        self.df['Order_List'] = self.df['Order_List'].apply(lambda x: eval(x) if isinstance(x, str) else x)
        
        # Explode the Order_List to create user-item interactions
        self.df_exploded = self.df.explode('Order_List')
        
        # Create user-item matrix for collaborative filtering
        self.user_item_matrix = pd.crosstab(
            self.df_exploded['User_ID'], 
            self.df_exploded['Order_List']
        ).astype(float)
        
        # Fill NaN values with 0
        self.user_item_matrix = self.user_item_matrix.fillna(0)
        
        # Scale the data
        self.user_item_matrix_scaled = pd.DataFrame(
            self.scaler.fit_transform(self.user_item_matrix),
            index=self.user_item_matrix.index,
            columns=self.user_item_matrix.columns
        )
        
        return self.user_item_matrix_scaled
    
    def train_model(self, n_neighbors=3):
        # Initialize and train the model
        self.model = NearestNeighbors(
            n_neighbors=n_neighbors + 1,  # +1 because it will find the user itself
            metric='cosine',
            algorithm='brute'
        )
        self.model.fit(self.user_item_matrix_scaled)
    
    def get_recommendations(self, user_id: int, n_recommendations: int = 3):
        if user_id not in self.user_item_matrix.index:
            raise HTTPException(
                status_code=404, 
                detail=f"User {user_id} not found in the training data"
            )
        
        # Get user's row index
        user_idx = self.user_item_matrix_scaled.index.get_loc(user_id)
        
        # Find similar users
        distances, indices = self.model.kneighbors(
            self.user_item_matrix_scaled.iloc[user_idx:user_idx+1],
            n_neighbors=n_recommendations + 1
        )
        
        # Convert distances to similarity scores (1 - distance)
        similarity_scores = 1 - distances.flatten()
        
        # Remove the user itself from recommendations
        similar_user_indices = indices.flatten()[1:]
        similarity_scores = similarity_scores[1:]
        
        # Get user's current items
        user_items = set(self.df_exploded[self.df_exploded['User_ID'] == user_id]['Order_List'].tolist())
        
        # Get weighted recommendations
        weighted_rec = pd.DataFrame(0, 
            index=self.user_item_matrix.columns, 
            columns=['score']
        )
        
        for idx, score in zip(similar_user_indices, similarity_scores):
            user_vector = self.user_item_matrix.iloc[idx]
            weighted_rec['score'] += user_vector * score
        
        # Sort and filter recommendations
        recommendations = weighted_rec.sort_values('score', ascending=False)
        
        # Filter out items the user already has
        recommendations = recommendations[~recommendations.index.isin(user_items)]
        
        # Get top N recommendations
        top_n = recommendations.head(n_recommendations)
        
        return top_n.index.tolist(), top_n['score'].tolist()

# Initialize recommender system and a global menu mapping dictionary
recommender = RecommenderSystem()
menu_mapping = {}

@app.on_event("startup")
async def startup_event():
    global menu_mapping
    # Load and prepare data for the recommender
    recommender.load_data("Core_ml/Models/Data")
    # Train the model
    recommender.train_model()
    data_path = os.path.abspath("Data")
    # Load the menu CSV file and create a mapping dictionary (Menu ID -> Menu Name)
    menu_csv_path = os.path.join(data_path, "menu.csv")
    try:
        menu_df = pd.read_csv(menu_csv_path)
        # Ensure the Menu ID column is of type int if necessary
        menu_df["Menu ID"] = menu_df["Menu ID"].astype(int)
        menu_mapping = dict(zip(menu_df["Menu ID"], menu_df["Menu Name"]))
    except Exception as e:
        print(f"Error loading menu CSV: {e}")

@app.post("/recommend/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    recommended_items, similarity_scores = recommender.get_recommendations(
        request.user_id,
        request.num_recommendations
    )
    
    # Map the recommended order IDs to menu names using the loaded menu_mapping
    menu_recommendations = []
    for menu_id, score in zip(recommended_items, similarity_scores):
        menu_name = menu_mapping.get(menu_id, "Unknown Menu")
        menu_recommendations.append(MenuRecommendation(
            menu_id=menu_id,
            menu_name=menu_name,
            similarity_score=score
        ))
    
    return RecommendationResponse(
        user_id=request.user_id,
        recommended_items=menu_recommendations
    )

@app.get("/get_waiting")
async def get_waiting_time():
    """
    This route iterates through each CSV file in the Data folder,
    calculates the waiting time (difference between Order_Complete_Time and Order_Placed_Time)
    in minutes for each order, computes the average waiting time for the file/outlet,
    and returns a JSON response excluding any outlets that encountered errors.
    """
    data_path = os.path.abspath("Data")
    csv_files = glob.glob(os.path.join(data_path, "*.csv"))
    results = {}

    for file in csv_files:
        try:
            df = pd.read_csv(file)
            # Convert the time columns to datetime objects
            df["Order_Placed_Time"] = pd.to_datetime(df["Order_Placed_Time"], errors='coerce')
            df["Order_Complete_Time"] = pd.to_datetime(df["Order_Complete_Time"], errors='coerce')

            # Drop any rows where conversion failed
            df = df.dropna(subset=["Order_Placed_Time", "Order_Complete_Time"])

            # Calculate waiting time in minutes
            df["waiting_time"] = (df["Order_Complete_Time"] - df["Order_Placed_Time"]).dt.total_seconds() / 60

            # Compute the average waiting time for this CSV file/outlet
            avg_waiting_time = df["waiting_time"].mean()

            # Use the file name (without extension) as the outlet name
            outlet_name = os.path.splitext(os.path.basename(file))[0]

            # Only add valid results (ignoring NaN cases)
            if not pd.isna(avg_waiting_time):
                results[outlet_name] = round(avg_waiting_time, 2)

        except Exception as e:
            # Ignore errors and move on to the next file
            continue

    return results

@app.get("/forecast")
def get_forecast(location: str = None):
    if location:
        # Return forecast for a specific location
        if location not in models:
            return {"error": "Invalid location. Choose from: andheri, dadar, borivali, bhayander"}
        
        model_file, scaler_file = models[location]
        forecast = generate_forecast(model_file, scaler_file)
        return {"location": location, "forecast": forecast}

    # If no location is provided, return forecasts for all locations
    forecasts = {loc: generate_forecast(*files) for loc, files in models.items()}
    return {"forecast":forecasts}

def get_lat_lon(place):
    geolocator = Nominatim(user_agent="geo_finder", timeout=10)
    location = geolocator.geocode(place)
    if location:
        return {"latitude": location.latitude, "longitude": location.longitude}
    else:
        return {"error": "Location not found"}

@app.get("/get_location/")
async def get_location():
    data_path = os.path.abspath("Data")
    locations = []

    for file in os.listdir(data_path):
        if file.endswith(".csv"):  # Ensure it processes only CSV files
            location_name = os.path.splitext(file)[0]  # Remove '.csv' extension
            if location_name == "menu":  # Skip "menu.csv"
                continue
            lat_lon = get_lat_lon(location_name)  # Get lat & lon
            locations.append({"name": location_name, **lat_lon})  # Store name & lat-lon

    return {"locations": locations}

@app.get("/get_predicted_locations/")
async def get_predicted_locations():
    data_path = os.path.abspath("Data")
    locations = []
    for file in os.listdir(data_path):
        if file.endswith(".csv"):  # Ensure it processes only CSV files
            location_name = os.path.splitext(file)[0]  # Remove '.csv' extension

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
