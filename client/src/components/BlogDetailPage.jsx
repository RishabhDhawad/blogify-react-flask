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
    body: '',
    image: null
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
            body: response.data.data.body,
            image: null
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
      body: blog.body,
      image: null
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditedBlog({
        ...editedBlog,
        image: e.target.files[0]
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', editedBlog.title);
      formData.append('body', editedBlog.body);
      if (editedBlog.image) {
        formData.append('image', editedBlog.image);
      }

      const response = await axios.put(`http://localhost:5000/blog/${id}/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

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
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="p-4 text-gray-600">Blog post not found</div>;
  }

  return (
    <div className="w-full p-4">
      {isEditing ? (
        <div className="border border-gray-200 rounded p-4">
          <input
            type="text"
            value={editedBlog.title}
            onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded mb-4 text-lg"
          />
          <textarea
            value={editedBlog.body}
            onChange={(e) => setEditedBlog({ ...editedBlog, body: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded mb-4 min-h-[200px]"
          />
          <div className="mb-4">
            <label className="block mb-1">Update Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-200 p-2 rounded"
            />
          </div>
          <div>
            <button 
              onClick={handleSave}
              className="p-2 border border-gray-200 rounded mr-2 text-blue-600 hover:bg-blue-50"
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="p-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded p-4">
          <h1 className="text-2xl font-medium mb-4">{blog.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            Published on {new Date(blog.created_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {blog.image_filename && (
            <div className="mb-4">
              <img 
                src={`http://localhost:5000/static/uploads/${blog.image_filename}`}
                alt={blog.title}
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  console.error('Error loading image:', e);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <p className="mb-4">{blog.body}</p>
          <div>
            <button 
              onClick={handleEdit}
              className="p-2 border border-gray-200 rounded mr-2 text-blue-600 hover:bg-blue-50"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 border border-gray-200 rounded text-red-600 hover:bg-red-50"
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
