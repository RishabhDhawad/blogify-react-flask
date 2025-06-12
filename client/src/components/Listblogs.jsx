import React, { useEffect, useState } from 'react'

function Listblogs() {
  const [fetchedBlogs, setFetchedBlogs] = useState([]);

  useEffect(() => {
    // Fetch the list of blogs from the Flask backend
    fetch("http://localhost:5000/listblogs") // Ensure this matches your Flask backend
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFetchedBlogs(data); // Set the fetched blogs from the response
      })
      .catch(error => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold">All Blog Posts</h2>
      {fetchedBlogs.length > 0 ? (
        fetchedBlogs.map(blog => (
          <div key={blog.id} className="bg-white border border-gray-300 p-3 mb-2 rounded">
            <h3>
              <a href={`/detail/${blog.id}`} className="text-blue-600 hover:underline">{blog.title}</a>
            </h3>
            <div className="text-gray-600 text-sm">
              Published on {new Date(blog.created_date).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </div>
          </div>
        ))
      ) : (
        <p>No blog posts yet. Create your first blog post above!</p>
      )}
    </div>
  );
}

export default Listblogs;
