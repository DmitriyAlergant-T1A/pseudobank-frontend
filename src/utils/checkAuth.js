// src/utils/checkAuth.js

const checkAuth = async () => {
    try {
      const response = await fetch('/profile', {
        credentials: 'include' // Important for including cookies in the request if using sessions
      });
      if (response.ok) {
        const data = await response.json();
        return data ? true : false; // Check if data exists
      }
      return false;
    } catch (error) {
      //console.error('Error checking authentication:', error);
      return false;
    }
  };
  
  export default checkAuth;
  