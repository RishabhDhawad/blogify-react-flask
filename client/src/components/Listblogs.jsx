import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../config'

function ListBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${config.apiUrl}/api/blogs`);
      
      if (response.data.success) {
        setBlogs(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load blogs');
      }
    } catch (err) {
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Blog Posts</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No blog posts found.
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="border rounded p-4 hover:bg-gray-50 transition-colors">
              <h2 className="text-lg font-semibold mb-2">
                <Link 
                  to={`/blog/${blog.id}`} 
                  className="text-blue-600 hover:text-blue-800"
                >
                  {blog.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-2 line-clamp-2">{blog.body}</p>
              <p className="text-sm text-gray-500">
                Created by {blog.author} on {new Date(blog.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ListBlogs