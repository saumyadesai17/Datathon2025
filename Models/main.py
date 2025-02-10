import ast
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.requests import Request  # Correct way to import request in FastAPI
from fastapi.responses import JSONResponse  # Equivalent to Flas
from fastapi.encoders import jsonable_encoder
from typing import Dict, List, Optional
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import glob
import csv
import secrets
import os
import certifi
import ssl
from google import genai
from datetime import datetime, timedelta
from pydantic import BaseModel,EmailStr
from fastapi.middleware.cors import CORSMiddleware
import joblib
from collections import Counter
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import json
import requests
from collections import Counter
from dotenv import load_dotenv
load_dotenv()
os.environ['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')
os.environ['SSL_CERT_FILE'] = certifi.where()

class SignupRequest(BaseModel):
    full_name: str
    Phone_Number: str
    email: EmailStr  # Ensures valid email format
    location: str
    password: str
    confirm_password: str

class MenuRecommendation(BaseModel):
    menu_id: int
    menu_name: str
    similarity_score: float

# Updated response model to include menu details
class RecommendationResponse(BaseModel):
    user_id: int
    recommended_items: List[MenuRecommendation]


class UserProfile(BaseModel):
    full_name: str
    Phone_Number: str
    email: EmailStr
    location: str

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    location: Optional[str] = None
    # current_password: Optional[str] = None
    # new_password: Optional[str] = None
# Define request model for login
class LoginRequest(BaseModel):
    Phone_Number: str
    password: str

class OrderRequest(BaseModel):
    burger_name: str
    quantity: int
# Pydantic models for response structure
class Competitor(BaseModel):
    name: str
    location: str

class RentableShop(BaseModel):
    name: str
    location: str
    rent_price: str

class ShopAnalysisResponse(BaseModel):
    Competitors: List[Competitor]
    Rentable_Shops: List[RentableShop]
    
    class Config:
        allow_population_by_field_name = True
        json_schema_extra = {
            "example": {
                "Competitors": [
                    {"name": "competitor_1", "location": "location_1"}
                ],
                "Rentable_Shops": [
                    {"name": "shop_1", "location": "location_1", "rent_price": "35000"}
                ]
            }
        }

class CityRequest(BaseModel):
    city: str

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
class RecommendationRequest(BaseModel):
    Phone_Number: str
    num_recommendations: Optional[int] = 5
def get_user_id_by_phone(phone_number: str) -> Optional[int]:
    """Search for the user_id based on Phone_Number in all CSV files inside the 'Data' folder."""
    DATA_PATH = os.path.abspath("Data")
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=500, detail="Data folder not found")

    # Loop through all CSV files in the Data directory
    for file_name in os.listdir(DATA_PATH):
        if file_name.endswith(".csv"):
            file_path = os.path.join(DATA_PATH, file_name)
            print(f"Checking file: {file_path}")  # Debugging

            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                # Debug: Print detected column names
                print(f"Columns found: {reader.fieldnames}")

                for row in reader:
                    # Debugging: Print each row being checked
                    #print(f"Checking row: {row}")

                    # Strip whitespace from phone number fields
                    if row.get("Phone_Number", "").strip() == phone_number.strip():
                        try:
                            return int(row.get("User_ID", "").strip())   # Convert to int and return
                        except ValueError:
                            print(f"Invalid user_id format in row: {row}")  # Debugging

    return None  # If not found
@app.post("/recommend/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    # Find user_id from phone number
    user_id = get_user_id_by_phone(request.Phone_Number)
    print(user_id)

    if user_id is None or user_id == -1:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch recommendations
    recommended_items, similarity_scores = recommender.get_recommendations(
        user_id,
        request.num_recommendations
    )

    # Map recommended menu IDs to menu names (Assuming menu_mapping is predefined)
    menu_recommendations = [
        MenuRecommendation(
            menu_id=menu_id,
            menu_name=menu_mapping.get(menu_id, "Unknown Menu"),
            similarity_score=score
        )
        for menu_id, score in zip(recommended_items, similarity_scores)
    ]

    return RecommendationResponse(
        user_id=user_id,
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
    try:
        location = geolocator.geocode(place)
        if location:
            return {"latitude": location.latitude, "longitude": location.longitude}
        else:
            return {"error": "Location not found"}
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        return {"error": f"Geocoder error: {str(e)}"}

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



@app.get("/get_missing_locations/")
async def get_missing_locations():
    data_path = os.path.abspath("Data")
    locations = []
    
    # Step 1: Get Outlet Locations
    for file in os.listdir(data_path):
        if file.endswith(".csv"):
            location_name = os.path.splitext(file)[0]  # Extract location name
            locations.append(location_name)
    
    # Step 2: Get User Locations from CSV Data
    user_locations = []
    for file in os.listdir(data_path):
        if file.endswith(".csv"):
            location_name = os.path.splitext(file)[0]
            if location_name == "menu":
                continue
            df = pd.read_csv(os.path.join(data_path, file))
            user_locations.extend(df["User_Location"].dropna().tolist())  # Remove NaN values
    
    # Step 3: Find Locations Where No Outlet Exists
    missing_locations = [loc for loc in user_locations if loc not in locations]
    
    # Step 4: Count the Occurrences of Missing Locations
    missing_location_counts = Counter(missing_locations)
    
    # Step 5: Fetch Latitude & Longitude for Each Location
    location_data = {}
    for location, count in missing_location_counts.items():
        coords = get_lat_lon(location)

        # **Fix: Check if 'latitude' exists in the response**
        if "latitude" in coords and "longitude" in coords:
            location_data[location] = {
                "count": count,
                "latitude": coords["latitude"],
                "longitude": coords["longitude"]
            }
        else:
            location_data[location] = {
                "count": count,
                "error": coords.get("error", "Location not found")
            }

    return location_data


@app.post("/signup")
async def signup(user: SignupRequest):
    # Validate password confirmation
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Define CSV file path
    auth_path = os.path.abspath("Auth")
    if not os.path.exists(auth_path):
        os.makedirs(auth_path)

    csv_file = os.path.join(auth_path, "user_signup.csv")

    # Debugging: Print file path to verify its location
    print(f"CSV file path: {csv_file}")

    # Check if the file exists, create headers if missing
    file_exists = os.path.exists(csv_file)

    try:
        with open(csv_file, 'a', newline='\n',encoding='utf-8') as f:
            writer = csv.writer(f)

            # If file is newly created, add headers
            if not file_exists:
                headers = ['full_name', 'Phone_Number', 'email', 'location', 'password', 'confirm_password']
                writer.writerow(headers)

            # Append user data
            writer.writerow([
                user.full_name,
                user.Phone_Number,
                user.email,
                user.location,
                user.password,
                user.confirm_password
            ])

            f.flush()  # Force write the data to file immediately

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing to CSV: {e}")

    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: LoginRequest):
    AUTH_DIR = os.path.abspath("Auth")
    SIGNUP_FILE = os.path.join(AUTH_DIR, "user_signup.csv")
    LOGIN_FILE = os.path.join(AUTH_DIR, "user_login.csv")
    # Check if signup file exists
    if not os.path.exists(SIGNUP_FILE):
        raise HTTPException(status_code=400, detail="No registered users found")

    # Read the CSV file to check credentials
    with open(SIGNUP_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Phone_Number'] == user.Phone_Number and row['password'] == user.password:
                # Generate a random access token
                access_token = secrets.token_hex(16)

                # Store the access token in user_login.csv
                with open(LOGIN_FILE, 'a', newline='\n', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    writer.writerow([user.Phone_Number, access_token])

                return {"message": "Login successful", "access_token": access_token}

    # If no match found, return unauthorized error
    raise HTTPException(status_code=401, detail="Invalid phone number or password")

# Function to get the most sold item for a given outlet CSV file
def get_most_sold_item(file_path):
    DATA_DIR = os.path.abspath("Data")
    menu_file = os.path.join(DATA_DIR, "menu.csv")
    menu_df = pd.read_csv(menu_file)  # CSV should have 'Menu ID' and 'Menu Name' columns
    menu_mapping = dict(zip(menu_df["Menu ID"], menu_df["Menu Name"]))
    try:
        df = pd.read_csv(file_path)
        all_items = []

        # Extract and count item occurrences
        for order in df["Order_List"]:
            item_list = ast.literal_eval(order)  # Convert string list to Python list
            all_items.extend(item_list)

        item_counts = Counter(all_items)
        most_sold_item, max_count = item_counts.most_common(1)[0]

        return {
            "Most Sold Item ID": most_sold_item,
            "Most Sold Item Name": menu_mapping.get(most_sold_item, "Unknown Item"),
            "Count": max_count
        }
    except Exception as e:
        return {"error":str(e)}

@app.get("/most_sold_items")
def most_sold_items():
    DATA_DIR = os.path.abspath("Data")
    dadar_file = os.path.join(DATA_DIR, "Dadar.csv")
    andheri_file = os.path.join(DATA_DIR, "Andheri.csv")
    borivali_file = os.path.join(DATA_DIR, "Borivali.csv")
    bhayandar_file = os.path.join(DATA_DIR, "Bhayandar.csv")
    outlets = {
        "Dadar": dadar_file,
        "Andheri": andheri_file,
        "Borivali": borivali_file,
        "Bhayandar": bhayandar_file
    }

    results = {}

    for outlet, file in outlets.items():
        results[outlet] = get_most_sold_item(file)

    return results

class SalesResponse(BaseModel):
    filename: str
    total_sales: float
    total_orders: int
    average_order_value: float

@app.get("/get_total_sales/", response_model=List[SalesResponse])
async def sales_respond() -> List[SalesResponse]:
    """
    Calculate total sales from Order_Bill for each CSV file in the DATA directory.
    Returns a list of SalesResponse objects containing filename and sales metrics.
    """
    try:
        DATA_DIR = os.path.abspath("Data")
        # Get list of all CSV files in the DATA directory
        csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]
        
        if not csv_files:
            raise HTTPException(status_code=404, detail="No CSV files found in DATA directory")
        
        result = []
        
        # Process each CSV file
        for filename in csv_files:
            file_path = os.path.join(DATA_DIR, filename)
            try:
                # Skip menu.csv as it doesn't contain order data
                if filename.lower() == 'menu.csv':
                    continue
                    
                # Read CSV file
                df = pd.read_csv(file_path)
                
                # Check if Order_Bill column exists
                if 'Order_Bill' not in df.columns:
                    print(f"Warning: Order_Bill column not found in {filename}")
                    continue
                
                # Calculate total sales from Order_Bill column
                total_sales = df['Order_Bill'].sum()
                
                # Get additional statistics
                order_count = len(df)
                avg_order_value = float(total_sales) / order_count if order_count > 0 else 0
                
                result.append(SalesResponse(
                    filename=filename,
                    total_sales=float(total_sales),
                    total_orders=order_count,
                    average_order_value=round(avg_order_value, 2)
                ))
                
            except pd.errors.EmptyDataError:
                print(f"Warning: {filename} is empty")
                continue
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
                continue
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@app.get("/profile/{phone_number}", response_model=UserProfile)

async def get_profile(phone_number: str):
    auth_path = os.path.abspath("Auth")
    csv_file = os.path.join(auth_path, "user_signup.csv")

    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            for row in reader:
                if row['Phone_Number'] == phone_number:
                    return {
                        "full_name": row['full_name'],
                        "Phone_Number": row['Phone_Number'],
                        "email": row['email'],
                        "location": row['location']

                    }

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading user data: {str(e)}"

        )
 
@app.put("/profile/{phone_number}", response_model=UserProfile)

async def update_profile(phone_number: str, profile_update: UpdateProfileRequest):
    auth_path = os.path.abspath("Auth")
    csv_file = os.path.join(auth_path, "user_signup.csv")
    temp_file = os.path.join(auth_path, "temp_user_signup.csv")

    try:
        user_found = False
        rows = []
        # Read existing data

        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            headers = reader.fieldnames

            for row in reader:
                if row['Phone_Number'] == phone_number:
                    user_found = True

                    if profile_update.full_name:
                        row['full_name'] = profile_update.full_name

                    if profile_update.email:
                        row['email'] = profile_update.email

                    if profile_update.location:
                        row['location'] = profile_update.location
                rows.append(row)
 
        if not user_found:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
 
        # Write updated data
        with open(temp_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(rows)
 
        # Replace original file with  file
        os.replace(temp_file, csv_file)
        # Return updated profile
        return {
            "full_name": next(row['full_name'] for row in rows if row['Phone_Number'] == phone_number),
            "Phone_Number": phone_number,
            "email": next(row['email'] for row in rows if row['Phone_Number'] == phone_number),
            "location": next(row['location'] for row in rows if row['Phone_Number'] == phone_number)
        }
 
    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating profile: {str(e)}"
        )
    
@app.get("/process-data")
def process_data():
    # Absolute path to the DATA directory
    DATA_DIR = os.path.abspath("Data")
    print(f"Looking for CSV files in: {DATA_DIR}")
    
    if not os.path.exists(DATA_DIR):
        raise HTTPException(status_code=404, detail="DATA directory not found.")

    results = []  # List to hold the processed results

    # Loop over each file in the DATA directory
    filenames = [os.path.join(DATA_DIR, f) for f in os.listdir(DATA_DIR) if f.lower().endswith('.csv')]
    print("Loading CSV files", filenames)
    
    for file_path in filenames:
        filename = os.path.basename(file_path)
        # Skip files whose name starts with "menu"
        if filename.lower().startswith("menu"):
            print(f"Skipping file: {filename}")
            continue

        try:
            # Read CSV file into a pandas DataFrame
            df = pd.read_csv(file_path)
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            continue

        try:
            # Convert Order_Placed_Time to datetime
            df['Order_Placed_Time'] = pd.to_datetime(df['Order_Placed_Time'])
        except Exception as e:
            print(f"Error converting Order_Placed_Time in {filename}: {e}")
            continue

        # Sort the DataFrame by Order_Placed_Time
        df_sorted = df.sort_values(by='Order_Placed_Time')

        # Extract date from Order_Placed_Time for daily grouping
        df_sorted['Order_Date'] = df_sorted['Order_Placed_Time'].dt.date

        # Group by Order_Date and sum the Order_Bill to compute daily sales
        daily_sales = df_sorted.groupby('Order_Date', as_index=False)['Order_Bill'].sum()

        # Convert the daily sales DataFrame to a list of dictionaries
        sales_list = daily_sales.to_dict(orient='records')

        results.append({
            "filename": filename.split('.')[0],
            "sales": sales_list
        })

    # Use jsonable_encoder to convert non-serializable types (like date) into serializable ones
    json_compatible_data = jsonable_encoder({"results": results})
    return JSONResponse(content=json_compatible_data)
@app.post("/add_order/{phone_number}")
async def add_order(phone_number: str, order: OrderRequest):
    # Ensure the file is stored in the "Auth" directory
    auth_path = os.path.abspath("Auth")  # Correct directory
    if not os.path.exists(auth_path):
        os.makedirs(auth_path)
 
    csv_file = os.path.join(auth_path, "order.csv")  # Use "Auth/order.csv"
 
    # Generate current timestamp in ISO format
    ordered_time = datetime.utcnow().isoformat()
 
    # Check if file exists, create headers if missing
    file_exists = os.path.exists(csv_file)
 
    try:
        with open(csv_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
 
            # If file is newly created, add headers
            if not file_exists:
                headers = ['Phone_Number', 'name', 'quantity', 'ordered_time']
                writer.writerow(headers)
 
            # Append order data
            writer.writerow([
                phone_number,  # Taken from URL path
                order.burger_name,
                order.quantity,
                ordered_time  # Auto-generated timestamp
            ])
 
            f.flush()  # Force write the data to file immediately
 
            # Debugging: Read back to verify
            print(f"✅ Order added: {phone_number}, {order.burger_name}, {order.quantity}, {ordered_time}")
 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing to CSV: {e}")
 
    return {
        "message": "Order added successfully",
        "ordered_time": ordered_time
    }
   
 
ORDER_FILE = "Auth/order.csv"
 
# Read orders from CSV
def read_orders():
    if not os.path.exists(ORDER_FILE):
        return []
   
    orders = []
    with open(ORDER_FILE, mode="r", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            orders.append(row)
    return orders
 
# Get user-specific orders
@app.get("/get_orders/{phone_number}")
def get_orders(phone_number: str):
    orders = read_orders()
    user_orders = [order for order in orders if order["Phone_Number"] == phone_number]
 
    if not user_orders:
        raise HTTPException(status_code=404, detail="No orders found for this phone number.")
 
    return {"orders": user_orders}
import json
def show_json(obj):
  print(json.dumps(obj.model_dump(exclude_none=True), indent=2)) 
# Initialize Google AI client
client = genai.Client(http_options={'api_version': 'v1alpha'})
MODEL = 'gemini-2.0-flash-exp'
@app.post("/analyze-location", response_model=ShopAnalysisResponse)
async def analyze_location(request: CityRequest) -> Dict:
    try:
        import json
        # Create prompt
        prompt = f"""The user has a fast food chain and wants to open a new outlet in a new city. 
        The name of the new outlet will be given, and you have to do the following:
        1. Find the competitors of the company in that city.
        2. Find available shops get_lat_lonthat the user can rent, along with the rent price.
        The city is {request.city}

        You have to return the data in JSON format. Please don't duplicate the data i.e name multiple same name.
        Strictly follow this JSON format:

        {{
            "Competitors": [
                {{"name": "competitor_1", "location": "competitor_1_location"}},
                {{"name": "competitor_2", "location": "competitor_2_location"}}
            ],
            "Rentable_Shops": [
                {{"name": "shop_1", "location": "shop_1_location(give exact location of area)", "rent_price": "35000"}},
                {{"name": "shop_2", "location": "shop_2_location(give exact location of area)", "rent_price": "40000"}}
            ]
        }}

        Note: Use underscore in 'Rentable_Shops' key name and use 'rent_price' instead of 'rent price'.
        """

        # Configure search tool
        search_tool = {'google_search': {}}
        
        # Create chat instance
        chat = client.chats.create(model=MODEL, config={'tools': [search_tool]})
        
        # Send message and get response
        response = chat.send_message(prompt)
        
        # Extract text from response and clean it up
        result_text = ""
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'text'):
                result_text += part.text.strip()
            else:
                show_json(part)    
        
        # Debug the response
        print("Raw response text:", result_text)
        
        try:
            # Look for JSON content between curly braces
            start_idx = result_text.find('{')
            end_idx = result_text.rfind('}') + 1
            if start_idx != -1 and end_idx != -1:
                json_str = result_text[start_idx:end_idx]
                result_json = json.loads(json_str)
                
                # Transform the response to match our model
                if "Rentable Shops" in result_json:
                    # Rename the key
                    result_json["Rentable_Shops"] = result_json.pop("Rentable Shops")
                    
                # Transform rent price key if needed
                for shop in result_json.get("Rentable_Shops", []):
                    if "rent price" in shop:
                        shop["rent_price"] = shop.pop("rent price")
                
                return result_json
            else:
                raise ValueError("No JSON content found in response")
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            raise HTTPException(status_code=500, detail="Invalid JSON response from AI service")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")



class CityRequest(BaseModel):
    city: str
from twilio.rest import Client
def send_whatsapp(city: str):
    # Twilio credentials
    account_sid = "AC794a6d3c32085192652213cd6e12073b"
    auth_token = "cc943a33bcae8fe6f07cc18721692075"
    client_twilio = Client(account_sid, auth_token)
    message_body = f"""
    🍔🚀 Foodago is Now in {city}! 🚀🍔

    Hey {city}, we heard you loud and clear! So many of you have been traveling to our other outlets just to get a taste of Foodago’s delicious burgers, crispy fries, and signature shakes. Now, you don’t have to go far—because we’re finally here! 🎉

    📍 New Foodago Outlet Now Open in {city}!

    To celebrate, we’re treating you to exclusive first-week offers you won’t want to miss! 🎁🔥

    Come in, grab a bite, and experience the Foodago flavors you love—closer than ever! 🍟🍔

    #FoodagoIn{city} #GrandOpening #TasteTheHype
    """
    
    # Send WhatsApp message
    message = client_twilio.messages.create(
        from_='whatsapp:+14155238886',
        body=message_body,
        media_url=['https://drive.google.com/uc?id=1UyRsWOl2mz6WZvG0EfND1JIqEzzV52V1'],
        to='whatsapp:+919322764396'  # Update with the correct recipient number
    )
    print(message.sid)
    return "success"

@app.post("/send-whatsapp/")
async def send_message(city_request: CityRequest):
    city = city_request.city
    result = send_whatsapp(city)
    return {"message": result,"city":city}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)