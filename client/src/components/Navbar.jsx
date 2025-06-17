import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const updateUserState = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial check
    updateUserState();

    // Listen for storage changes in other tabs
    window.addEventListener('storage', updateUserState);
    
    // Listen for custom event for same-tab changes
    window.addEventListener('userStateChanged', updateUserState);

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateUserState);
      window.removeEventListener('userStateChanged', updateUserState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Dispatch custom event
    window.dispatchEvent(new Event('userStateChanged'));
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/list-blogs" className="hover:text-gray-300">List Blog</Link>
          {user && (
            <Link to="/create-blog" className="hover:text-gray-300">Create Blog</Link>
          )}
        </div>
        <div className="flex space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;