
        #this is a python web framework application using Flask


from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import requests  # Added missing import

app = Flask(__name__)
CORS(app)

# Define the path to the data file
DATA_FILE = "data/anime_list.json"

# Ensure the data directory exists
os.makedirs("data", exist_ok=True)

# Create the data file if it doesn't exist
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump({"anime_list": []}, f)


def load_data():
    """Load the anime data from the JSON file."""
    with open(DATA_FILE, 'r') as f:
        return json.load(f)


def save_data(data):
    """this will save the anime data to the JSON file."""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)


# Routes
@app.route("/anime-list", methods=["GET"])
def get_anime_list():
    """this gets from saved list of anime."""
    data = load_data()
    return jsonify(data["anime_list"])


@app.route("/anime-list", methods=["POST"])
def add_to_list():
    """Add a new anime to the list."""
    anime = request.json
    data = load_data()
    """prevent adding duplicates."""
    if any(item["id"] == anime["id"] for item in data["anime_list"]):
        return jsonify({"message": "Anime already in list"}), 400

    data["anime_list"].append(anime)
    save_data(data)
    return jsonify({"message": "Anime added successfully"}), 201




@app.route("/anime-list", methods=["DELETE"])
def remove_from_list():
    """Remove a single anime or clear all."""
    data = load_data()
    payload = request.json

    if payload.get("clearAll"):  # Clear all anime
        data["anime_list"] = []
        save_data(data)
        return jsonify({"message": "All anime cleared."}), 200

    anime_id = payload.get("id")
    if anime_id is not None:
        data["anime_list"] = [
            anime for anime in data["anime_list"] if anime["id"] != anime_id
        ]
        save_data(data)
        return jsonify({"message": "Anime removed successfully."}), 200

    return jsonify({"error": "No id or clearAll provided"}), 400



@app.route("/recommendations", methods=["POST"])
def get_recommendations():
    """Get/fetches anime recommendations based on anime IDs."""
    ids = request.json.get("ids", [])
    recommendations = []

    for anime_id in ids:
        query = """
        query($id: Int) {
          Media(id: $id, type: ANIME) {
            recommendations {
              edges {
                node {
                  mediaRecommendation {
                    id
                    title { romaji }
                    coverImage { large }
                    averageScore
                    episodes
                  }
                }
              }
            }
          }
        }
        """
        resp = requests.post(
            "https://graphql.anilist.co",
            json={"query": query, "variables": {"id": anime_id}},
            headers={"Content-Type": "application/json"},
        )

        try:
            rec_data = resp.json()
        except ValueError:
            print(f"Invalid JSON response for anime ID {anime_id}: {resp.text}")
            continue

        # Check if response contains the expected structure
        if "data" not in rec_data or not rec_data["data"].get("Media"):
            print(f"No media found or invalid structure for anime ID {anime_id}")
            continue

        media = rec_data["data"]["Media"]
        recs = media.get("recommendations", {}).get("edges", [])
        for edge in recs:
            recommendations.append(edge["node"]["mediaRecommendation"])

    # Remove duplicates
    unique_recs = {rec["id"]: rec for rec in recommendations}.values()
    return jsonify(list(unique_recs))



if __name__ == "__main__":
    app.run(debug=True)
