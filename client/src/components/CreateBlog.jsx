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

    const user = localStorage.getItem('user');
    if (!user) {
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
      const response = await axios.post(`${config.apiUrl}/api/submit`, formData);

      if (response.data.success) {
        setTitle('');
        setBody('');
        setFile(null);
        navigate('/list-blogs');
      } else {
        setError(response.data.message || 'Failed to create blog');
      }
    } catch (err) {
      setError('An error occurred while creating the blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-8">
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