import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Listblogs from './components/Listblogs';
import CreateBlog from './components/CreateBlog';
import BlogDetail from './components/BlogDetail';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(); // get the current location

  useEffect(() => {
    fetch('http://localhost:5000/') // Fetch from your Flask backend
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
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/detail/:id" element={<BlogDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;