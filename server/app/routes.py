# from flask import jsonify
# from . import create_app, db
# from .models import Blog

# app = create_app()

# @app.route('/api/data')
# def get_data():
#     return jsonify({"message": "Welcome To Blog Post Application, Data from Flask backend!"})

# @app.route('/api/navbar', methods=['GET'])
# def get_navbar():
#     return jsonify({
#         "links": [
#             {"name": "Home", "url": "/"},
#             {"name": "List Blogs", "url": "/listblogs"},
#             {"name": "Create Blog", "url": "/create"},
#             {"name": "Login", "url": "/login"},
#             {"name": "Register", "url": "/register"},
#         ]
#     })

