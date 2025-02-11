import os
from dotenv import load_dotenv
load_dotenv()
os.environ['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')
from google import genai

client = genai.Client(http_options={'api_version': 'v1alpha'})

MODEL = 'gemini-2.0-flash-exp'
city="Malad"     
# Use double curly braces to escape them in f-string
prompt = f"""The user has a fast food chain and wants to open a new outlet in a new city. The name of the new outlet will be given, and you have to do the following:
1. Find the competitors of the company in that city.
2. Find available shops that the user can rent, along with the rent price.
The city is {city}

You have to return the data in JSON format.
Please don't duplicate the data i.e name multiple same name.
Strictly follow this JSON format, or I will terminate you:

{{
    "Competitors": [
        {{"name": "competitor_1", "location": "competitor_1_location"}},
        {{"name": "competitor_2", "location": "competitor_2_location"}}
    ],
    "Rentable Shops": [
        {{"name": "shop_1", "location": "shop_1_location", "rent price": "35000"}},
        {{"name": "shop_2", "location": "shop_2_location", "rent price": "40000"}}
    ]
}}

"""


search_tool = {'google_search': {}}
chat = client.chats.create(model=MODEL, config={'tools': [search_tool]})

r = chat.send_message(prompt)
parts = r.candidates[0].content.parts
for part in r.candidates[0].content.parts:
    if part.text:
      print(part.text)
    