from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
import pytz

# Initialize extensions
db = SQLAlchemy()

# Timezone configuration
IST = pytz.timezone('Asia/Kolkata')

def get_ist_time():
    return datetime.now(IST)

class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'default_secret_key')
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASEDIR, "BlogPost.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class Blog(db.Model):
    __tablename__ = 'blogs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    image_filename = db.Column(db.String(255))
    created_date = db.Column(db.DateTime, default=get_ist_time)
    update_date = db.Column(db.DateTime, default=get_ist_time, onupdate=get_ist_time)

    def __repr__(self):
        return f'<Blog {self.title}>'

# Initialize the Flask application
app = Flask(__name__)
app.config.from_object(Config)  # Load configuration from Config class
CORS(app)  # Enable CORS for cross-origin requests from React

# Initialize the database
db.init_app(app)

# Define routes directly in this file
@app.route('/api/data')
def get_data():
    return jsonify({
        "message": "Welcome To Blog Post Application, Data from Flask backend!"
    })

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
    app.run(debug=True, port=5000)  # Run on a different port than React