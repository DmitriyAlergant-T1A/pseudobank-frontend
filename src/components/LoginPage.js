import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import

function LoginPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Updated hook

  const handleLogin = () => {
    navigate('/main', { state: { email } }); // Updated navigation
  };

  return (
    <div className="centered-content">
      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Bank Logo" className="App-logo" />
      <br/><br/>
      <div className="login-controls">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Login</button>
      </div>
    </div>
  );

}

export default LoginPage;