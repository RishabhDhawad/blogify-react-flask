import React from 'react'

function CreateBlog() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Create New Blog</h1>
      <form action="/submit" method="POST" encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">Blog Title</label>
          <input
            id="title"
            name="title"
            required
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="body" className="block mb-1">Blog Content</label>
          <textarea
            id="body"
            name="body"
            required
            className="w-full border border-gray-300 p-2 rounded resize-y min-h-[100px]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block mb-1">Upload Image (Optional)</label>
          <input
            accept="image/*"
            id="file"
            name="file"
            type="file"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded"
        >
          Publish Blog
        </button>
      </form>
    </div>
  )
}

export default CreateBlog
