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
    blogs = Blog.query.all() # fetch data from the DB
    return jsonify([{
        "id": blog.id,
        "title": blog.title,
        "body": blog.body,
        "image": blog.image_filename,
        "created_date": blog.created_date.isoformat() # Convert date time into string
    } for blog in blogs])


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



@app.route('/posts/edits/<int:id>', methods=['GET', 'POST'])
def edit_blog(id):
    """
    Handle blog post editing
    GET: Display edit form
    POST: Process edit form and update blog post
    Requires user authentication
    """
    blog = Blog.query.get_or_404(id)

    if request.method == 'POST':
        blog.title = request.form['title']
        blog.body = request.form['body']

        # Handle image updates
        file = request.files.get('file')
        if file and file.filename:
            # Remove old image if exists
            if blog.image_filename:
                old_photo_path = os.path.join(current_app.static_folder, 'uploads', blog.image_filename)
                if os.path.exists(old_photo_path):
                    os.remove(old_photo_path)

            # Save new image
            new_filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
            file.save(file_path)
            blog.image_filename = new_filename

        # Handle image removal
        elif 'remove_image' in request.form:
            if blog.image_filename:
                old_photo_path = os.path.join(current_app.static_folder, 'uploads', blog.image_filename)
                if os.path.exists(old_photo_path):
                    os.remove(old_photo_path)
                blog.image_filename = None

        db.session.commit()
        flash('Blog post updated successfully')
        return redirect(url_for('listblogs'))
    else:
        return render_template('edit.html', blog=blog, current_image=blog.image_filename)



if __name__ == '__main__':
    with app.app_context():  # Needed for DB operations
        db.create_all()  # Creates the database and tables
    app.run(debug=True, port=5000)  # Run on a different port than React
