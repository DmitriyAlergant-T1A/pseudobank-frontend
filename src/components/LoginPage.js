import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import Logo from './Logo';

function LoginPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Updated hook

  const handleLogin = () => {
    navigate('/main', { state: { email } }); // Updated navigation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Logo />
      <div className="mt-8 w-full max-w-xs">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 w-full border rounded shadow-sm"
        />
        <button onClick={handleLogin} className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out">Login</button>
      </div>
    </div>
  );

}

export default LoginPage;