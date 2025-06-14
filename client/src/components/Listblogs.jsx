import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Listblogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get('http://localhost:5000/listblogs');
        
        if (response.data.success) {
          setBlogs(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-medium mb-6">All Blog Posts</h2>
      
      {blogs.length === 0 ? (
        <p className="text-gray-600">No blog posts yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="border border-gray-200 rounded p-4">
              <h3 className="text-lg">
                <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:text-blue-800">
                  {blog.title}
                </Link>
              </h3>
              <div className="text-sm text-gray-500 mt-1">
                Published on {new Date(blog.created_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Listblogs
