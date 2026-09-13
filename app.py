from flask import Flask, request, jsonify, send_from_directory
from classifier import classify_issue

app = Flask(__name__, static_folder=".", static_url_path="")

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/classify", methods=["POST"])
def classify():
    data = request.json
    issue = data.get("issue", "")

    category = classify_issue(issue)

    return jsonify({"category": category})

if __name__ == "__main__":
    app.run(debug=True)