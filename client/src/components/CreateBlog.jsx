import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to create a blog');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (file) {
      formData.append('file', file);
    }

    try {
      console.log('Submitting blog with token:', token); // Debug log
      const response = await axios.post(`${config.apiUrl}/api/submit`, formData, {
        headers: {
          'Authorization': token
        }
      });

      console.log('Server response:', response.data); // Debug log

      if (response.data.success) {
        // Clear form
        setTitle('');
        setBody('');
        setFile(null);
        // Navigate to list blogs
        navigate('/list-blogs');
      } else {
        setError(response.data.message || 'Failed to create blog');
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('An error occurred while creating the blog');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="6"
            className="w-full border border-gray-300 p-2 rounded"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Image (optional)
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*"
            className="w-full border border-gray-300 p-2 rounded"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;