import React, { useState } from 'react';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMsg('Registered successfully! Redirecting to login...');
        setTimeout(() => (window.location.href = '/login'), 1500);
      } else {
        setError(data.msg || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Register</h2>

      {error && <p className="text-red-500">{error}</p>}
      {msg && <p className="text-green-600">{msg}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-1 rounded">
          Register
        </button>
      </form>

      <div className="mt-3 text-center">
        <a href="/login" className="text-blue-500">
          Already have an account? Login here.
        </a>
      </div>
    </div>
  );
}

export default RegisterPage;
