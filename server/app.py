from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests from React

# Hello World API
@app.route('/api/data')
def get_data():
    return jsonify({"message": "Welcome To Blog Post Application, Data from Flask backend!"})

# API for Navbar
@app.route('/api/navbar', methods=['GET'])
def get_navbar():
    return jsonify({
        "links": [
            {"name": "Home", "url": "/"},
            {"name": "List Blogs", "url": "/listblogs"},
            {"name": "Create Blog", "url": "/createblog"},
            {"name": "Login", "url": "/login"},
            {"name": "Register", "url": "/register"},
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Run on a different port than React
    