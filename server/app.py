from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import secrets
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='../client/dist')
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secrets.token_hex(16)
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
    session_token = db.Column(db.String(100), unique=True)
    blogs = db.relationship('Blog', backref='author', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def generate_session_token(self):
        token = secrets.token_hex(16)
        self.session_token = token
        db.session.commit()
        return token

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

        token = new_user.generate_session_token()

        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'data': {
                'token': token,
                'user': {
                    'id': new_user.id,
                    'username': new_user.username,
                    'email': new_user.email
                }
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during registration'
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ['username', 'password']):
            return jsonify({
                'success': False,
                'message': 'Missing username or password'
            }), 400

        user = User.query.filter_by(username=data['username']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401

        token = user.generate_session_token()
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': {
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during login'
        }), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({
                'success': False,
                'message': 'No token provided'
            }), 401

        user = User.query.filter_by(session_token=token).first()
        if user:
            user.session_token = None
            db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Logged out successfully'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during logout'
        }), 500

@app.route('/api/submit', methods=['POST'])
def submit_blog():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({
                'success': False,
                'message': 'No token provided'
            }), 401

        user = User.query.filter_by(session_token=token).first()
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid token'
            }), 401

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
            user_id=user.id
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
                'created_at': new_blog.created_at.isoformat(),
                'author': user.username
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An error occurred while creating the blog'
        }), 500

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
                'created_at': blog.created_at.isoformat(),
                'author': blog.author.username
            } for blog in blogs]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred while fetching blogs'
        }), 500

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
                'created_at': blog.created_at.isoformat(),
                'author': blog.author.username
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
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({
                'success': False,
                'message': 'No token provided'
            }), 401

        user = User.query.filter_by(session_token=token).first()
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid token'
            }), 401

        blog = Blog.query.get_or_404(id)
        if blog.user_id != user.id:
            return jsonify({
                'success': False,
                'message': 'Not authorized to edit this blog'
            }), 403

        data = request.get_json()
        if not data or not all(k in data for k in ['title', 'body']):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400

        blog.title = data['title']
        blog.body = data['body']
        if 'image' in data:
            blog.image = data['image']
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Blog updated successfully',
            'data': {
                'id': blog.id,
                'title': blog.title,
                'body': blog.body,
                'image': blog.image,
                'created_at': blog.created_at.isoformat(),
                'author': user.username
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred while updating the blog'
        }), 500

@app.route('/api/blog/<int:id>', methods=['DELETE'])
def delete_blog(id):
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({
                'success': False,
                'message': 'No token provided'
            }), 401

        user = User.query.filter_by(session_token=token).first()
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid token'
            }), 401

        blog = Blog.query.get_or_404(id)
        if blog.user_id != user.id:
            return jsonify({
                'success': False,
                'message': 'Not authorized to delete this blog'
            }), 403

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

@app.route('/api/home', methods=['GET'])
def home():
    try:
        return jsonify({
            'success': True,
            'message': 'Welcome to the Blog Application!'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred while loading the homepage'
        }), 500

@app.route('/static/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
    