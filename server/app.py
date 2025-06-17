from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    blogs = db.relationship('Blog', backref='author', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Blog(db.Model):
    __tablename__ = 'blogs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# Initialize database
def init_db():
    with app.app_context():
        db.create_all()

# Initialize database when the application starts
init_db()

# Register User API
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ['username', 'email', 'password']):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400

        if User.query.filter_by(username=data['username']).first():
            return jsonify({
                'success': False,
                'message': 'Username already exists'
            }), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'message': 'Email already exists'
            }), 400

        new_user = User(username=data['username'], email=data['email'])
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'data': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during registration'
        }), 500

# Login User API
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({
                'success': False,
                'message': 'Missing email or password'
            }), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during login'
        }), 500

# Submit Blog API in Create Blog
@app.route('/api/submit', methods=['POST'])
def submit_blog():
    try:
        data = request.form
        if not data or not all(k in data for k in ['title', 'body']):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400

        image_path = None
        if 'file' in request.files:
            file = request.files['file']
            if file and file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_path = filename

        new_blog = Blog(
            title=data['title'],
            body=data['body'],
            image=image_path,
            user_id=1  # Default user ID for now
        )
        
        db.session.add(new_blog)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Blog created successfully',
            'data': {
                'id': new_blog.id,
                'title': new_blog.title,
                'body': new_blog.body,
                'image': new_blog.image,
                'created_at': new_blog.created_at.isoformat()
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An error occurred while creating the blog'
        }), 500

#  List Blogs API
@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    try:
        blogs = Blog.query.order_by(Blog.created_at.desc()).all()
        return jsonify({
            'success': True,
            'data': [{
                'id': blog.id,
                'title': blog.title,
                'body': blog.body,
                'image': blog.image,
                'created_at': blog.created_at.isoformat()
            } for blog in blogs]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred while fetching blogs'
        }), 500

# To Fetch Single Single Blog
@app.route('/api/blog/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    try:
        blog = Blog.query.get_or_404(blog_id)
        return jsonify({
            'success': True,
            'data': {
                'id': blog.id,
                'title': blog.title,
                'body': blog.body,
                'image': blog.image,
                'created_at': blog.created_at.isoformat()
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred while fetching the blog'
        }), 500


@app.route('/api/blog/<int:id>/edit', methods=['PUT'])
def edit_blog(id):
    try:
        blog = Blog.query.get_or_404(id)

        # Handle form data for image upload
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form
            if not data or not all(k in data for k in ['title', 'body']):
                return jsonify({
                    'success': False,
                    'message': 'Missing required fields'
                }), 400

            # Handle image upload
            if 'file' in request.files:
                file = request.files['file']
                if file and file.filename:
                    # Delete old image if it exists
                    if blog.image:
                        old_image_path = os.path.join(app.config['UPLOAD_FOLDER'], blog.image)
                        if os.path.exists(old_image_path):
                            os.remove(old_image_path)
                    
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(file_path)
                    blog.image = filename
        else:
            # Handle JSON data
            data = request.get_json()
            if not data or not all(k in data for k in ['title', 'body']):
                return jsonify({
                    'success': False,
                    'message': 'Missing required fields'
                }), 400

        blog.title = data['title']
        blog.body = data['body']
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Blog updated successfully',
            'data': {
                'id': blog.id,
                'title': blog.title,
                'body': blog.body,
                'image': blog.image,
                'created_at': blog.created_at.isoformat()
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An error occurred while updating the blog'
        }), 500

# Delete Blog API
@app.route('/api/blog/delete/<int:id>', methods=['DELETE'])
def delete_blog(id):
    try:
        blog = Blog.query.get_or_404(id)
        db.session.delete(blog)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Blog deleted successfully'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred while deleting the blog'
        }), 500

# Home Page API
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'success': True,
        'message': 'Welcome to Blog Application!'
    })

# Images are stored on this route
@app.route('/static/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
    