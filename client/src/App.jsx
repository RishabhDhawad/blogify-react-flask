import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/homepage';
import ListBlogs from './components/Listblogs';
import CreateBlog from './components/CreateBlog';
import BlogDetailPage from './components/BlogDetailPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/list-blogs" element={<ListBlogs />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/blog/:id/edit" element={<BlogDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;