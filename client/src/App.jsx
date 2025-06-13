import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Listblogs from './components/Listblogs';
import CreateBlog from './components/CreateBlog';
import BlogDetailPage from './components/BlogDetailPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="p-4">
        {/* <p>{message}</p> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/listblogs" element={<Listblogs />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;