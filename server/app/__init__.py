# from flask import Flask
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# import os

# # Initialize extensions
# db = SQLAlchemy()

# def create_app():
#     app = Flask(__name__)
#     CORS(app)  # Enable CORS for cross-origin requests from React
#     app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY') or 'default_secret_key'
    
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'BlogPost.db')
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#     # Initialize the database
#     db.init_app(app)

#     # Import routes
#     from .routes import routes  # Ensure routes is a blueprint

#     app.register_blueprint(routes)  # Register the blueprint

#     return app
