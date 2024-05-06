// PrepopulateButton.js
import React from 'react';

export function PrepopulateButtonsContainer({ children }) {
  return (
    <div className="fixed top-0 right-0 m-1.5 flex flex-col justify-items-end">
      {children}
    </div>
  );
}

 export function PrepopulateButton({ profileData, setFormData, clearChatMessages, label }) {
  return (
    <button
      type="button"
      onClick={() => {
          setFormData(profileData); 
          clearChatMessages();
      }}
      className="m-1 p-2 bg-gray-500 text-white text-xs hover:bg-blue-700"
    >
      {label}
    </button>
  );
}