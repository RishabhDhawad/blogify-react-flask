# Blogify - A Modern Blog Application

A full-stack blog application built with React and Flask, featuring a clean and intuitive user interface for creating, reading, updating, and deleting blog posts. This application provides a seamless experience for both bloggers and readers with its modern design and robust functionality.

![Blogify](https://img.shields.io/badge/Blogify-React%20%7C%20Flask-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Node](https://img.shields.io/badge/Node-14%2B-green)

## 🌟 Features

### User Authentication
- Secure login and registration system with JWT tokens
- Protected routes and session management
- Email validation and password security

### Blog Management
- Create, edit, and delete blog posts
- Image upload and preview functionality
- Responsive grid layout for blog listing
- Real-time content editing

### Modern UI/UX
- Responsive design for all devices
- Clean and intuitive interface
- Loading states and error handling
- Smooth navigation and transitions

## 🛠️ Tech Stack

### Frontend
- React.js 18 with functional components and hooks
- React Router v6 for navigation
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Flask (Python) with RESTful API
- SQLAlchemy for database operations
- SQLite database
- Flask-CORS for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Git

### Environment Setup

1. **Clone and Setup:**
```bash
git clone https://github.com/yourusername/blogify.git
cd blogify
```

2. **Backend Setup:**
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure Environment:**
Create `.env` in server directory:
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///blog.db
```

4. **Frontend Setup:**
```bash
cd client
npm install
npm run dev
```

5. **Access the Application:**
Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
blogify/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config.js      # Configuration settings
│   │   └── App.jsx        # Main application component
│   └── package.json
│
└── server/                # Backend Flask application
    ├── app.py            # Main Flask application
    ├── models/          # Database models
    ├── routes/          # API routes
    └── uploads/         # Image upload directory
```

## 🔒 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - User login

### Blog Operations
- `GET /api/blogs` - Get all blog posts
- `GET /api/blog/<id>` - Get a specific blog post
- `POST /api/submit` - Create a new blog post
- `PUT /api/blog/<id>/edit` - Update a blog post
- `DELETE /api/blog/<id>` - Delete a blog post

## 🤝 Contributing

We welcome contributions to improve Blogify! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

- Made with 💖 by Rishabh Dhawad

