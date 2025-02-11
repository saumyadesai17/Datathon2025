import pandas as pd
from pymongo import MongoClient
import os
from datetime import datetime

def clean_collection_name(collection_name):
    """
    Clean collection name to get just the last part of the path
    """
    # Split by path separator and get the last part
    return collection_name.split('/')[-1].split('\\')[-1]

def export_from_mongodb(uri, output_folder='Exported_Data'):
    """
    Export all collections from MongoDB database to CSV files.
    
    Parameters:
    uri (str): MongoDB connection URI
    output_folder (str): Folder where CSV files will be saved
    """
    try:
        # Create output folder if it doesn't exist
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
            print(f"Created output folder: {output_folder}")
        
        # Connect to MongoDB
        client = MongoClient(uri)
        db = client['Mcd']
        
        # Get list of all collections
        collections = db.list_collection_names()
        
        for collection_name in collections:
            try:
                # Get collection
                collection = db[collection_name]
                
                # Fetch all documents
                documents = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB _id field
                
                if documents:
                    # Convert to DataFrame
                    df = pd.DataFrame(documents)
                    
                    # Convert datetime objects to string for CSV compatibility
                    if 'Order_Placed_Time' in df.columns:
                        df['Order_Placed_Time'] = df['Order_Placed_Time'].dt.strftime('%Y-%m-%d %H:%M:%S')
                    if 'Order_Complete_Time' in df.columns:
                        df['Order_Complete_Time'] = df['Order_Complete_Time'].dt.strftime('%Y-%m-%d %H:%M:%S')
                    
                    # Clean collection name and generate filename
                    clean_name = clean_collection_name(collection_name)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    filename = f"{clean_name}_{timestamp}.csv"
                    filepath = os.path.join(output_folder, filename)
                    
                    # Save to CSV
                    df.to_csv(filepath, index=False)
                    print(f"Successfully exported {clean_name} to {filepath}")
                else:
                    print(f"No documents found in collection {collection_name}")
                    
            except Exception as e:
                print(f"Error exporting collection {collection_name}: {e}")
                continue
                
        print("Export process completed!")
        
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
    
    finally:
        if 'client' in locals():
            client.close()

# Usage example
if __name__ == "__main__":
    mongodb_uri = "mongodb+srv://Hackathon:59ILYisG4iNaGNRU@cluster0.w6oegog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    export_from_mongodb(mongodb_uri, "Exported_Data")