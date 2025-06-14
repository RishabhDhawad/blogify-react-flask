from tkinter import image_names

from flask import Flask, jsonify, render_template, request, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
import pytz
from werkzeug.utils import secure_filename

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
app = Flask(__name__, static_folder='static')
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

# List all Blogs API
@app.route('/listblogs', methods=['GET'])
def get_listblogs():
    """ Fetch all blogs and return them in JSON"""
    try:
        blogs = Blog.query.all() # fetch data from the DB
        return jsonify({
            "success": True,
            "data": [{
                "id": blog.id,
                "title": blog.title,
                "body": blog.body,
                "image": blog.image_filename,
                "created_date": blog.created_date.isoformat() # Convert date time into string
            } for blog in blogs]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching blogs: {str(e)}"
        }), 500


# Submit Blog API
@app.route('/submit', methods=['POST'])
def submit():
    try:
        title = request.form.get('title', '').strip()
        body = request.form.get('body', '').strip()

        if not title or not body:
            return jsonify({
                "success": False,
                "message": "Title and body are required"
            }), 400  # Validation Error

        file = request.files.get('file')
        image_filename = None

        # Handle File Upload
        if file and file.filename:
            filename = secure_filename(file.filename)
            if filename:
                # Create uploads directory if it doesn't exist
                upload_folder = os.path.join(app.config['BASEDIR'], 'static', 'uploads')
                os.makedirs(upload_folder, exist_ok=True)
                
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                image_filename = filename
            else:
                return jsonify({
                    "success": False,
                    "message": "File type not allowed"
                }), 400  # Validation Errors

        # Save blog to database
        new_blog = Blog(
            title=title,
            body=body,
            image_filename=image_filename
        )
        db.session.add(new_blog)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Blog Post created successfully",
            "blog_id": new_blog.id
        }), 201  # Successful Creation

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error creating blog post: {str(e)}"
        }), 500     # Server Error


# Detail page - shows a specific blog post
@app.route('/blog/<int:id>', methods=['GET'])
def detail(id):
    try:
        blog = Blog.query.get_or_404(id)
        return jsonify({
            "success": True,
            "data": {
                "id": blog.id,
                "title": blog.title,
                "body": blog.body,
                "image_filename": blog.image_filename,
                "created_date": blog.created_date.isoformat(),
                "update_date": blog.update_date.isoformat()
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error fetching blog post: {str(e)}"
        }), 500


# Edit the Blog After click on edit button
@app.route('/blog/<int:id>/edit', methods=['PUT'])
def edit_blog(id):
    try:
        blog = Blog.query.get_or_404(id)
        
        # Get form data
        title = request.form.get('title')
        body = request.form.get('body')
        file = request.files.get('image')
        
        if not title and not body and not file:
            return jsonify({
                "success": False,
                "message": "No data provided"
            }), 400

        # Update blog fields
        if title:
            blog.title = title
        if body:
            blog.body = body
        
        # Handle image update if provided
        if file and file.filename:
            # Remove old image if exists
            if blog.image_filename:
                old_image_path = os.path.join(app.config['BASEDIR'], 'static', 'uploads', blog.image_filename)
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)

            # Save new image
            filename = secure_filename(file.filename)
            upload_folder = os.path.join(app.config['BASEDIR'], 'static', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            blog.image_filename = filename
        
        # Update the update_date
        blog.update_date = get_ist_time()
        
        try:
            db.session.commit()
            return jsonify({
                "success": True,
                "data": {
                    "id": blog.id,
                    "title": blog.title,
                    "body": blog.body,
                    "image_filename": blog.image_filename,
                    "created_date": blog.created_date.isoformat(),
                    "update_date": blog.update_date.isoformat()
                }
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({
                "success": False,
                "message": f"Error updating blog: {str(e)}"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error finding blog post: {str(e)}"
        }), 404


# Delete the Blog After click on delete button
@app.route('/blog/<int:id>', methods=['DELETE'])
def delete_post(id):
    """
    Delete a blog post and its associated image
    """
    try:
        post_to_delete = Blog.query.get_or_404(id)

        # Delete associated image file
        if post_to_delete.image_filename:
            photo_path = os.path.join(app.config['BASEDIR'], 'static', 'uploads', post_to_delete.image_filename)
            if os.path.exists(photo_path):
                os.remove(photo_path)

        # Delete blog post from database
        db.session.delete(post_to_delete)
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Blog post deleted succesfully"
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error deleting blog post {str(e)}"
        }), 500



if __name__ == '__main__':
    with app.app_context():  # Needed for DB operations
        db.create_all()  # Creates the database and tables
    app.run(debug=True, port=5000)  # Run on a different port than React
