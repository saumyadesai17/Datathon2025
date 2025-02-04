import os
import json
import pandas as pd
import streamlit as st
from collections import Counter
from google import genai
from geopy import Nominatim
from dotenv import load_dotenv
from pydantic import BaseModel
from twilio.rest import Client

# Load environment variables
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv('GOOGLE_API_KEY')

# Initialize Google Gemini AI
client = genai.Client(http_options={'api_version': 'v1alpha'})
MODEL = 'gemini-2.0-flash-exp'

# Define cities with existing outlets
EXISTING_CITIES = {"dadar", "borivali", "andheri", "bhayandar"}

def get_lat_lon(place):
    """Get latitude and longitude for a given place name"""
    geolocator = Nominatim(user_agent="geo_finder", timeout=10)
    try:
        location = geolocator.geocode(place)
        if location:
            return {
                "latitude": location.latitude,
                "longitude": location.longitude
            }
    except Exception as e:
        print(f"Error getting coordinates for {place}: {str(e)}")
    return {"error": "Location not found"}

def get_existing_locations():
    """
    Instead of reading from files, we now rely on our predefined EXISTING_CITIES.
    This function is maintained in case you need to combine with your CSV data.
    """
    return list(EXISTING_CITIES)

def get_missing_locations():
    """Get missing locations from CSV data"""
    data_path = os.path.abspath("Data")
    locations = []
    
    # Step 1: Get Outlet Locations from file names (if any)
    for file in os.listdir(data_path):
        if file.endswith(".csv"):
            location_name = os.path.splitext(file)[0]
            locations.append(location_name)
    
    # Step 2: Get User Locations from CSV Data
    user_locations = []
    for file in os.listdir(data_path):
        if file.endswith(".csv"):
            location_name = os.path.splitext(file)[0]
            if location_name.lower() == "menu":
                continue
            df = pd.read_csv(os.path.join(data_path, file))
            user_locations.extend(df["User_Location"].dropna().tolist())
    
    # Step 3: Find Missing Locations: We'll treat all locations as potential.
    missing_locations = [loc for loc in user_locations if loc.lower() not in {l.lower() for l in locations}]
    
    # Step 4: Count Missing Locations
    missing_location_counts = Counter(missing_locations)
    
    # Step 5: Fetch Latitude & Longitude (for additional details if needed)
    location_data = {}
    for location, count in missing_location_counts.items():
        coords = get_lat_lon(location)
        if "error" not in coords:
            location_data[location] = {
                "count": count,
                "latitude": coords["latitude"],
                "longitude": coords["longitude"]
            }
    
    return location_data

def analyze_location(city):
    """Analyze the location using Google Gemini AI"""
    try:
        prompt = f"""The user has a fast food chain and wants to open a new outlet in {city}.
Find competitors and available shops for rent, with rent price.

Return JSON format:
{{
    "Competitors": [
        {{"name": "competitor_1", "location": "competitor_1_location"}},
        {{"name": "competitor_2", "location": "competitor_2_location"}}
    ],
    "Rentable_Shops": [
        {{"name": "shop_1", "location": "shop_1_location", "rent_price": "35000"}},
        {{"name": "shop_2", "location": "shop_2_location", "rent_price": "40000"}}
    ]
}}
"""
        # Configure search tool
        search_tool = {'google_search': {}}
        
        # Create chat instance
        chat = client.chats.create(model=MODEL, config={'tools': [search_tool]})
        
        # Send message and get response
        response = chat.send_message(prompt)
        
        # Extract text from response
        result_text = ""
        for part in response.candidates[0].content.parts:
            if hasattr(part, 'text'):
                result_text += part.text.strip()
        
        # Parse JSON response
        start_idx = result_text.find('{')
        end_idx = result_text.rfind('}') + 1
        if start_idx != -1 and end_idx != -1:
            json_str = result_text[start_idx:end_idx]
            result_json = json.loads(json_str)
            
            # Normalize response format if necessary
            if "Rentable Shops" in result_json:
                result_json["Rentable_Shops"] = result_json.pop("Rentable Shops")
            
            for shop in result_json.get("Rentable_Shops", []):
                if "rent price" in shop:
                    shop["rent_price"] = shop.pop("rent price")
            
            return result_json
        
        return {"error": "Invalid response format"}
    except Exception as e:
        return {"error": str(e)}

def display_city_analysis(city_name, analysis_data):
    """Display analysis for a single city with the appropriate color based on existence,
    and highlight the cheapest available space."""
    is_existing = city_name.lower() in EXISTING_CITIES
    status_class = "existing-location" if is_existing else "predicted-location"
    status_text = "Existing Outlet" if is_existing else "Potential Location"
    
    st.markdown(f"""
        <div class="location-card {status_class}">
            <h3>📍 {city_name}</h3>
            <p style="color: {'#00ff95' if is_existing else '#ffd700'}">{status_text}</p>
        </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 🏢 Competitors")
        for comp in analysis_data.get("Competitors", []):
            with st.expander(f"🏪 {comp['name']}", expanded=False):
                st.write(f"📌 Location: {comp['location']}")
    
    with col2:
        st.markdown("### 🏬 Available Spaces")
        for shop in analysis_data.get("Rentable_Shops", []):
            with st.expander(f"🔑 {shop['name']}", expanded=False):
                st.write(f"📌 Location: {shop['location']}")
                st.write(f"💰 Rent: ₹{shop['rent_price']}")
    
    # Compute and display the cheapest available space for this city
    rentable_shops = analysis_data.get("Rentable_Shops", [])
    cheapest_shop = None
    cheapest_rent = float('inf')
    for shop in rentable_shops:
        try:
            rent = int(shop["rent_price"])
        except (ValueError, TypeError):
            continue
        if rent < cheapest_rent:
            cheapest_rent = rent
            cheapest_shop = shop

    if cheapest_shop:
        st.markdown(f"""
            <div style="background-color: #222; border-left: 4px solid #00ff95; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <h4 style="color: #00ffd5;">Cheapest Available Space in {city_name}</h4>
                <p><strong>{cheapest_shop['name']}</strong></p>
                <p>Location: {cheapest_shop['location']}</p>
                <p>Rent: ₹{cheapest_shop['rent_price']}</p>
            </div>
        """, unsafe_allow_html=True)
    
    # Return the cheapest shop info for further processing
    if cheapest_shop:
        return {
            "city": city_name,
            "rent": cheapest_rent,
            "shop": cheapest_shop
        }
    else:
        return None

# Provided WhatsApp function and CityRequest model
class CityRequest(BaseModel):
    city: str

def send_whatsapp(city: str):
    # Twilio credentials
    account_sid = "AC794a6d3c32085192652213cd6e12073b"
    auth_token = "bba0ab1d696d750bcd96104bb0265021"
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

def main():
    # Set page config
    st.set_page_config(layout="wide", page_title="RetailAI - Location Analysis")
    
    # Add dark theme CSS with our chosen colour scheme
    st.markdown("""
        <style>
            .main {
                background-color: #121212;
                color: #ffffff;
            }
            .stApp {
                background-color: #121212;
            }
            .css-1d391kg, .css-1to0ky, section[data-testid="stSidebar"] {
                background-color: #1e1e1e;
            }
            .location-card {
                background-color: #1e1e1e;
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
            }
            .existing-location {
                border-left: 4px solid #00ff95;
            }
            .predicted-location {
                border-left: 4px solid #ffd700;
            }
            .metric-container {
                background-color: #1e1e1e;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            h1, h2, h3 {
                color: #00ffd5 !important;
            }
            .stButton>button {
                background-color: #00ffd5;
                color: #121212;
            }
            .stExpander {
                background-color: #1e1e1e;
                border: 1px solid #333;
            }
            .stProgress > div > div {
                background-color: #00ffd5;
            }
        </style>
    """, unsafe_allow_html=True)
    
    st.title("🏪 RetailAI - Location Analysis")
    st.markdown("### Analyze nearby competition, available shop spaces and identify the cheapest available space to optimize store location strategy.")
    
    # Get locations data from CSV files
    missing_locations = get_missing_locations()
    
    # Display metrics in styled containers
    existing_count = sum(1 for loc in missing_locations if loc.lower() in EXISTING_CITIES)
    potential_count = len(missing_locations) - existing_count
    total_customers = sum(loc["count"] for loc in missing_locations.values())
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(f"""
            <div class='metric-container'>
                <h4 style='color: #00ffd5'>Existing Locations</h4>
                <h2 style='color: #00ff95'>{existing_count}</h2>
            </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
            <div class='metric-container'>
                <h4 style='color: #00ffd5'>Potential Locations</h4>
                <h2 style='color: #ffd700'>{potential_count}</h2>
            </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
            <div class='metric-container'>
                <h4 style='color: #00ffd5'>Total Market Potential</h4>
                <h2 style='color: #ffffff'>{total_customers:,}</h2>
            </div>
        """, unsafe_allow_html=True)
    
    # Detailed Analysis section
    st.markdown("## 📊 Detailed Analysis")
    
    # Analyze top locations (top 3 by customer count)
    top_locations = dict(sorted(missing_locations.items(), 
                              key=lambda x: x[1]["count"], 
                              reverse=True)[:3])
    
    best_cheapest_data = None  # To store the overall best (lowest rent) info
    for city in top_locations.keys():
        with st.spinner(f"Analyzing {city}..."):
            analysis = analyze_location(city)
            if "error" not in analysis:
                # Display the analysis for the city
                city_cheapest = display_city_analysis(city, analysis)
                # If a cheapest shop was found for this city, check if it is the overall cheapest
                if city_cheapest:
                    if best_cheapest_data is None or city_cheapest["rent"] < best_cheapest_data["rent"]:
                        best_cheapest_data = city_cheapest
            else:
                st.error(f"Error analyzing {city}: {analysis['error']}")
    
    # After processing all cities, show the "Create Outlet" button if we have a cheapest location
    if best_cheapest_data:
        st.markdown(f"""
            <div style="background-color: #222; border-left: 4px solid #00ff95; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <h4 style="color: #00ffd5;">Overall Cheapest Available Space</h4>
                <p><strong>{best_cheapest_data['shop']['name']}</strong> in <strong>{best_cheapest_data['city']}</strong></p>
                <p>Rent: ₹{best_cheapest_data['shop']['rent_price']}</p>
            </div>
        """, unsafe_allow_html=True)
        if st.button("Create Outlet"):
            result = send_whatsapp(best_cheapest_data["city"])
            if result == "success":
                st.success(f"WhatsApp message sent for outlet creation in {best_cheapest_data['city']}!")
            else:
                st.error("Failed to send WhatsApp message.")
    else:
        st.info("No cheapest available space was found.")

if __name__ == "__main__":
    main()
