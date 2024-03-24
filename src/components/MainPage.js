import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import JuicyPixel from './JuicyPixel';
import useStore from '../store/store'; // Adjust the path as necessary
import Logo from './Logo';

function MainPage() {
  const { state } = useLocation();
  const email = state?.email; 
  const phoneNumber = '123-456-7890';

  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
  };

  const juicySessionId = useStore((state) => state.juicySessionId);

  return (
    <>
      <Logo />
      <div className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 mx-auto">
            <p className="mt-4 text-lg">Hello, <b>{email}</b> (<b>{phoneNumber}</b>)</p>
            {!showForm && (
              <button id="myFormButton" onClick={toggleForm} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out">I want to borrow cash</button>
            )}
            {showForm && (
              <form className="mt-4 p-6 bg-white rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <div className="font-semibold text-xl mb-4">Cash Loan Application</div>
                <div className="mb-4 flex items-center" >
                  <label htmlFor="amount" className="block w-2/3 text-sm font-medium text-gray-700">How much $ you are looking for:</label>
                  <input type="number" placeholder="$ amount" id="amount" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>
                <div className="flex mb-4 items-center">
                  <label htmlFor="term" className="block w-1/3 text-sm font-medium text-gray-700">Term length:</label>
                  <select id="term" className="mt-1 p-2 w-2/3 border rounded">
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    {/* Additional options */}
                  </select>
                </div>
                <div className="flex mb-4 items-center">
                  <label htmlFor="purpose" className="block w-1/3 text-sm font-medium text-gray-700">Purpose:</label>
                  <input type="text" placeholder="Purpose of the loan" id="purpose" className="w-2/3 mt-1 p-2 w-full border rounded" />
                </div>
                <button id="mySubmitButton" type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out">Submit</button>
              </form>
            )}

            {formSubmitted && (
              <>
                <div className="flex flex-col items-center w-full p-2 border rounded text-sm text-slate-400">
                  <div className="response-box">
                    <textarea value={`Session ID: ${juicySessionId}`} placeholder="Request submitted to Alokta" rows="6" readOnly className=""></textarea>
                  </div>
                  <div className="response-box">
                    <textarea placeholder="Alokta response: JuicyScore API Request" rows="6"></textarea>
                  </div>
                  <div className="response-box">
                    <textarea placeholder="Alokta response: JuicyScore API Response" rows="6"></textarea>
                  </div>
                  <div className="response-box">
                    <textarea placeholder="Alokta response: How Rules Worked" rows="6"></textarea>
                  </div>
                  <div className="response-box">
                    <textarea placeholder="Alokta response: Outcome Decisions" rows="6"></textarea>
                  </div>
                </div>
              </>
        )}
      </div>
      <JuicyPixel />
    </>
  );
}

export default MainPage;