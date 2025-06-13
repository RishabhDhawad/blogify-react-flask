import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState({
    title: '',
    body: ''
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`http://localhost:5000/blog/${id}`);
        
        if (response.data.success) {
          setBlog(response.data.data);
          setEditedBlog({
            title: response.data.data.title,
            body: response.data.data.body
          });
        } else {
          setError(response.data.message || 'Failed to load blog post');
        }
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedBlog({
      title: blog.title,
      body: blog.body
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.put(`http://localhost:5000/blog/${id}`, editedBlog);
      if (response.data.success) {
        setBlog(response.data.data);
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Failed to update blog post');
      }
    } catch (err) {
      setError('Failed to update blog post');
      console.error('Error updating blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        setLoading(true);
        setError('');
        const response = await axios.delete(`http://localhost:5000/blog/${id}`);
        if (response.data.success) {
          navigate('/listblogs');
        } else {
          setError(response.data.message || 'Failed to delete blog post');
        }
      } catch (err) {
        setError('Failed to delete blog post');
        console.error('Error deleting blog:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className="p-4">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedBlog.title}
            onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
            className="w-full p-2 border mb-4"
          />
          <textarea
            value={editedBlog.body}
            onChange={(e) => setEditedBlog({ ...editedBlog, body: e.target.value })}
            className="w-full p-2 border mb-4"
          />
          <div>
            <button 
              onClick={handleSave}
              className="p-2 border mr-2"
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="p-2 border"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>{blog.title}</h1>
          <p>
            Published on {new Date(blog.created_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p>{blog.body}</p>
          <div>
            <button 
              onClick={handleEdit}
              className="p-2 border mr-2"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 border"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogDetailPage
