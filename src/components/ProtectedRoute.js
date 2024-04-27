// src/components/ProtectedRoute.js

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import checkAuth from '../utils/checkAuth'; // Import the checkAuth function

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
      if (!authStatus) {
        // Redirect to server-side login route
        window.location.href = `/login`;
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
