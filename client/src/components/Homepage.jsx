import React, { useEffect, useState } from 'react'

function Homepage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the message from the Flask backend
    fetch("http://localhost:5000/") // Ensure this matches your Flask backend
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMessage(data.message); // Set the message from the response
      })
      .catch(error => console.error("Error fetching message: ", error));
  }, []);
  
  return (
    <div className='flex flex-col items-center p-4'>
      {/* <p>{message}</p> */}
      <p className='text-lg text-blue-400'>{message}</p>
    </div>
  )
}

export default Homepage
