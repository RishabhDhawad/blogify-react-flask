# import os
# import sys

# # Add the server directory to the Python path
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# from server.app import app, db, User, Blog

# def init_db():
#     with app.app_context():
#         # Drop all tables
#         db.drop_all()
#         print("Dropped all existing tables")

#         # Create all tables
#         db.create_all()
#         print("Created all tables successfully!")

#         # Verify tables were created
#         try:
#             # Check if User table exists and has correct columns
#             user_columns = User.__table__.columns.keys()
#             print(f"User table columns: {user_columns}")

#             # Check if Blog table exists and has correct columns
#             blog_columns = Blog.__table__.columns.keys()
#             print(f"Blog table columns: {blog_columns}")

#             print("Database initialization completed successfully!")
#         except Exception as e:
#             print(f"Error verifying tables: {str(e)}")

# if __name__ == '__main__':
#     init_db() 
