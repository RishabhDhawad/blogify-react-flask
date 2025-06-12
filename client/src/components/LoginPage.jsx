import React from 'react'

function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <form method="POST">
        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <a href="/register" className="text-blue-500 hover:underline">
          Don't have an account? Register here.
        </a>
      </div>
    </div>
  )
}

export default LoginPage
