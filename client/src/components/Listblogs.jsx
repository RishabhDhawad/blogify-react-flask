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
        setBlogs(response.data);
      } catch (err) {
        setError('Failed to load blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2>All Blog Posts</h2>
      
      {blogs.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        <div>
          {blogs.map((blog) => (
            <div key={blog.id} className="border p-4 mb-4">
              <h3>
                <Link to={`/blog/${blog.id}`}>
                  {blog.title}
                </Link>
              </h3>
              <div>
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
