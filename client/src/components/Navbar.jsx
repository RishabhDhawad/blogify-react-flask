import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/navbar") // Flask port
    .then(response => response.json())
    .then(data => setLinks(data.links))
    .catch(error => console.error("Error fetching navbar:", error))
  }, [])

  return (
    <nav className='bg-gray-800 p-3'>
      <ul className='flex space-x-4'>
        {links.map(link => (
          <li key={link.url}>
            <Link to={link.url} className='text-white '>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
