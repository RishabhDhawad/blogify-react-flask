import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className='bg-gray-800 p-3'>
      <div className='flex justify-between items-center'>
        <div className='nav-left flex space-x-4'>
          <Link to="/" className='text-white hover:text-gray-300'>Home</Link>
          <Link to="/listblogs" className='text-white hover:text-gray-300'>List Blogs</Link>
          {user && (
            <Link to="/createblog" className='text-white hover:text-gray-300'>Create Blog</Link>
          )}
        </div>
        
        <div className='nav-right flex items-center space-x-4'>
          {user ? (
            <>
              <span className='text-white'>Welcome, {user.username}!</span>
              <button 
                onClick={handleLogout}
                className='text-white hover:text-gray-300'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className='text-white hover:text-gray-300'>Login</Link>
              <Link to="/register" className='text-white hover:text-gray-300'>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
