import React from 'react'

function RegisterPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Register</h2>
      
      <form method="POST">
        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="w-full border border-gray-300 p-2"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border border-gray-300 p-2"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full border border-gray-300 p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-1 rounded"
        >
          Register
        </button>
      </form>
      
      <div className="mt-3 text-center">
        <a href="/login" className="text-blue-500">
          Already have an account? Login here.
        </a>
      </div>
    </div>
  )
}

export default RegisterPage
