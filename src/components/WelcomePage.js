import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import Logo from './Logo';

function WelcomePage() {
  const navigate = useNavigate(); // Updated hook

  const handleLogin = () => {
    navigate('/AuthenticatedAccountPage'); // Updated navigation
  };

  const handlePaydayApp = () => {
    navigate('/PaydayLoanApplication'); // Updated navigation
  };

  return (

    <>
      <Logo />

        <div className="flex flex-col items-center justify-center h-screen justify-beginning bg-gray-100">      
            <div className="mt-8 w-full max-w-md gap-8 text-xl">
              <button onClick={handleLogin}     className="     w-full h-16 bg-blue-500  text-white rounded hover:bg-blue-700  transition duration-150 ease-in-out">Login to My Account</button>
              <button onClick={handlePaydayApp} className="mt-8 w-full h-16 bg-green-800 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out">Simple Payday Loan Application</button>
            </div>
         </div>
    </>
  );

}

export default WelcomePage;