from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import networkx as nx

app = FastAPI()

# allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Green Line Stations ---
stations = [
    {"id": "S1", "name": "Khu Khot", "x": 600, "y": 100, "line": "green"},
    {"id": "S2", "name": "Yaek Kor Por Aor", "x": 500, "y": 200, "line": "green"},
    {"id": "S3", "name": "Phahon Yothin 59", "x": 500, "y": 300, "line": "green"},
    {"id": "S4", "name": "Sai Yud", "x": 500, "y": 400, "line": "green"},
]

# --- Green Line Connections ---
connections = []
for i in range(len(stations) - 1):
    connections.append({
        "from": stations[i]["id"],
        "to": stations[i + 1]["id"],
        "line": "green"
    })

# --- BUILD GRAPH ---
G = nx.Graph()
for s in stations:
    G.add_node(s["id"])
for c in connections:
    G.add_edge(c["from"], c["to"])

@app.get("/map")
def get_map():
    return {"stations": stations, "connections": connections}

@app.get("/route")
def get_route(start: str, end: str):
    try:
        path = nx.shortest_path(G, start, end)
        return {"path": path}
    except nx.NetworkXNoPath:
        return {"path": []}
