'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login for local use
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('admin_token', 'logged_in');
      router.push('/admin/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-bkash-pink">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 outline-none focus:ring-2 focus:ring-bkash-pink transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 outline-none focus:ring-2 focus:ring-bkash-pink transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-bkash-pink hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition"
          >
            ENTER DASHBOARD
          </button>
        </form>
      </div>
    </div>
  );
}
