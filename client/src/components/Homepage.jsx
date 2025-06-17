import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'

function Homepage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${config.apiUrl}/`);
        
        if (response.data.success) {
          setMessage(response.data.message);
        } else {
          setError(response.data.message || 'Failed to load message');
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setError('Failed to load message from server');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      ) : (
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">{message}</h1>
        </div>
      )}
    </div>
  )
}

export default Homepage