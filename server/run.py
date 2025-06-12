from flask import Flask, jsonify, render_template, request, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
import pytz

# Timezone configuration
IST = pytz.timezone('Asia/Kolkata')

def get_ist_time():
    return datetime.now(IST)

# Configuration class
class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'default_secret_key')
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASEDIR, "BlogPost.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Initialize extensions
db = SQLAlchemy()


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

# Home Page
@app.route('/')
def get_homepage():
    return jsonify({
        "message": "Welcome to my Blog"
    })

@app.route('/listblogs', methods=['GET'])
def get_listblogs():
    """ Fetch all blogs and return them in JSON"""
    blogs = Blog.query.all() # fetch data from the DB
    return jsonify([{
        "id": blog.id,
        "title": blog.title,
        "body": blog.body,
        "created_date": blog.created_date.isoformat() # Convert date time into string
    } for blog in blogs])
    # return render_template('listblogs')


if __name__ == '__main__':
    with app.app_context():  # Needed for DB operations
        db.create_all()  # Creates the database and tables
    app.run(debug=True, port=5000)  # Run on a different port than React
