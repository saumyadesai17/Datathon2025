import os
import pandas as pd
import networkx as nx
import ast
from itertools import combinations
import matplotlib.pyplot as plt
from networkx.algorithms import community

# Directory containing CSV files
data_folder = r"Core_ml\Models\Data"

# Load and merge all CSV files except 'menu.csv'
all_data = []
for filename in os.listdir(data_folder):
    if filename.endswith(".csv") and filename.lower() != "menu.csv":
        filepath = os.path.join(data_folder, filename)
        print(f"Loading: {filename}")
        df = pd.read_csv(filepath)
        all_data.append(df)

# Merge all DataFrames
if not all_data:
    print("No valid CSV files found!")
    exit()

df = pd.concat(all_data, ignore_index=True)
print(f"\nTotal Orders Processed: {len(df)}")

# Create an empty undirected graph
G = nx.Graph()

# Process each order in the merged DataFrame
for idx, row in df.iterrows():
    try:
        menu_ids = ast.literal_eval(row["Order_List"])  # Convert string to list
    except Exception as e:
        print(f"Error parsing Order_List in row {idx}: {e}")
        continue

    for menu_id in menu_ids:
        G.add_node(menu_id)

    if len(menu_ids) > 1:
        for item1, item2 in combinations(menu_ids, 2):
            if G.has_edge(item1, item2):
                G[item1][item2]['weight'] += 1
            else:
                G.add_edge(item1, item2, weight=1)

### 1. Most Frequently Ordered Pairs
sorted_edges = sorted(G.edges(data=True), key=lambda x: x[2]['weight'], reverse=True)
print("\nTop 5 Most Frequently Ordered Pairs:")
for u, v, data in sorted_edges[:5]:
    print(f"{u} -- {v}: {data['weight']} times")

### 2. Most Popular Items (High-Degree Nodes)
degree_dict = dict(G.degree())
top_degrees = sorted(degree_dict.items(), key=lambda x: x[1], reverse=True)[:5]
print("\nTop 5 Most Popular Items:")
for item, deg in top_degrees:
    print(f"Item {item}: Ordered with {deg} different items")

### 3. Community Detection
communities = list(community.greedy_modularity_communities(G))
print(f"\nDetected {len(communities)} communities.")
for i, comm in enumerate(communities[:3]):  # Show first 3 communities
    print(f"Community {i + 1}: {list(comm)}")

### 4. Centrality Metrics
degree_centrality = nx.degree_centrality(G)
betweenness_centrality = nx.betweenness_centrality(G)
closeness_centrality = nx.closeness_centrality(G)

print("\nTop 5 Items by Centrality Measures:")
for metric, values in [("Degree", degree_centrality), ("Betweenness", betweenness_centrality), ("Closeness", closeness_centrality)]:
    top_central = sorted(values.items(), key=lambda x: x[1], reverse=True)[:5]
    print(f"\nTop 5 by {metric} Centrality:")
    for item, score in top_central:
        print(f"Item {item}: {score:.4f}")

### 5. Finding Outliers (Isolated Nodes)
isolated_nodes = list(nx.isolates(G))
print(f"\nNumber of Isolated Items: {len(isolated_nodes)}")
if isolated_nodes:
    print(f"Sample: {isolated_nodes[:5]}")

