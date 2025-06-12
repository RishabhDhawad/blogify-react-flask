import React from 'react'

function BlogDetail({ blog }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2">{blog.title}</h1>

      <div className="text-gray-600 text-sm italic mb-4">
        Published on {new Date(blog.created_date).toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
        {/* Uncomment if you want to show the update date */}
        {/* {blog.update_date && (
          <> • Updated on {new Date(blog.update_date).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}</>
        )} */}
      </div>

      {blog.image_filename && (
        <div className="mb-4">
          <img
            alt={`Blog Image for ${blog.title}`}
            src={`/uploads/${blog.image_filename}`}
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="text-base mb-4">
        {blog.body.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      <div className="flex space-x-2 mb-4">
        <a href={`/edit/${blog.id}`}>
          <button className="bg-blue-500 text-white py-1 px-3 rounded">Update</button>
        </a>
        <a href={`/delete/${blog.id}`} onClick={() => confirm('Are you sure you want to delete this post?')}>
          <button className="bg-red-500 text-white py-1 px-3 rounded">Delete</button>
        </a>
      </div>

      <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
    </div>
  )
}

export default BlogDetail
