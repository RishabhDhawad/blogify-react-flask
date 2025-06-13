import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CreateBlog() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    try {
      const response = await axios.post('http://localhost:5000/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate('/listblogs');
      } else {
        setError(response.data.message || 'Failed to create blog');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Create New Blog</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        {/* Title Input Field */}
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">Blog Title</label>
          <input
            id="title"
            name="title"
            required
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            disabled={isSubmitting}
          />
        </div>

        {/* Content Textarea Field */}
        <div className="mb-4">
          <label htmlFor="body" className="block mb-1">Blog Content</label>
          <textarea
            id="body"
            name="body"
            required
            className="w-full border border-gray-300 p-2 rounded resize-y min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>
        
        {/* File Upload Field */}
        <div className="mb-4">
          <label htmlFor="file" className="block mb-1">Upload Image (Optional)</label>
          <input
            accept="image/*"  // this only allow image files
            id="file"
            name="file"
            type="file"
            className="w-full border border-gray-300 p-2 rounded"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button  */}
        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 px-4 rounded transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={isSubmitting}  // Disable button during submission
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default CreateBlog
