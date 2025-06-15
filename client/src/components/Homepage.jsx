import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'

function Homepage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/home`);
        if (response.data.success) {
          setMessage(response.data.message);
        } else {
          setError(response.data.message || 'Failed to load message');
        }
      } catch (error) {
        console.error("Error fetching message:", error);
        setError('Failed to load message from server');
      }
    };

    fetchMessage();
  }, []);
  
  return (
    <div className='flex flex-col items-center p-4'>
      {error ? (
        <p className='text-lg text-red-600'>{error}</p>
      ) : (
        <p className='text-lg text-blue-800'>{message}</p>
      )}
    </div>
  )
}

export default Homepage
