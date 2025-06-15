import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../config'

function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${config.apiUrl}/api/blog/${id}`);
      if (response.data.success) {
        setBlog(response.data.data);
        setEditedTitle(response.data.data.title);
        setEditedBody(response.data.data.body);
      } else {
        setError(response.data.message || 'Failed to load blog');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(blog.title);
    setEditedBody(blog.body);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${config.apiUrl}/api/blog/${id}/edit`,
        {
          title: editedTitle,
          body: editedBody
        },
        {
          headers: {
            'Authorization': token
          }
        }
      );

      if (response.data.success) {
        setBlog(response.data.data);
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Failed to update blog');
      }
    } catch (err) {
      console.error('Error updating blog:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('An error occurred while updating the blog');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.delete(`${config.apiUrl}/api/blog/${id}`, {
        headers: {
          'Authorization': token
        }
      });

      if (response.data.success) {
        navigate('/list-blogs');
      } else {
        setError(response.data.message || 'Failed to delete blog');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('An error occurred while deleting the blog');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  if (error && !blog) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const isAuthor = blog && localStorage.getItem('user') && 
    JSON.parse(localStorage.getItem('user')).username === blog.author;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="body"
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows="6"
              className="w-full border border-gray-300 p-2 rounded"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          {blog.image && (
            <img
              src={`${config.apiUrl}/static/uploads/${blog.image}`}
              alt={blog.title}
              className="max-w-full h-auto mb-4 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <p className="text-gray-600 whitespace-pre-wrap mb-4">{blog.body}</p>
          <p className="text-sm text-gray-500 mb-4">
            Created by {blog.author} on {new Date(blog.created_at).toLocaleDateString()}
          </p>
          
          {isAuthor && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`bg-red-500 text-white px-4 py-2 rounded ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogDetailPage