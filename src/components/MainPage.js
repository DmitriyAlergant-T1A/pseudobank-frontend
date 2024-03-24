import React, { useState, useRef } from 'react';
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
  const [requestPayload, setRequestPayload] = useState('');
  const [aloktaResponse, setAloktaResponse] = useState(false);
  

  // Moved useStore hook call to the top level
  const juicySessionId = useStore((state) => state.juicySessionId);

  const amountRef = useRef(null);
  const termRef = useRef(null);
  const purposeRef = useRef(null);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = amountRef.current.value;
    const term = termRef.current.value;
    const purpose = purposeRef.current.value;
  
    const requestBody = {
      customer_id: '123', // This should be dynamically set based on your application logic
      customer_email: email,
      customer_phone: phoneNumber,
      juicyscore_session_id: juicySessionId,
      requested_loan_amount: amount,
      requested_loan_purpose: purpose,
      requested_loan_term: term,
      decision_model: 'SimpleModel' // This should be dynamically set based on your application logic
    };

    setRequestPayload(JSON.stringify(requestBody, null, 2));
    setAloktaResponse('Submitting, please wait...')
    setFormSubmitted(true); // Move this line here to immediately show textboxes  

    try {
      const response = await fetch(
        '/backend/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Alokta decision response was not ok, status code ' + response.status);
      }
  
      const data = await response.json();
      setAloktaResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error submitting a request to Alokta:', error);
      setAloktaResponse(error);
    }
  };
  


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
                  <input ref={amountRef} type="number" placeholder="$ amount" id="amount" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>
                <div className="flex mb-4 items-center">
                  <label htmlFor="term" className="block w-1/3 text-sm font-medium text-gray-700">Term length:</label>
                  <select ref={termRef} id="term" className="mt-1 p-2 w-2/3 border rounded">
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    {/* Additional options */}
                  </select>
                </div>
                <div className="flex mb-4 items-center">
                  <label htmlFor="purpose" className="block w-1/3 text-sm font-medium text-gray-700">Purpose:</label>
                  <input ref={purposeRef} type="text" placeholder="Purpose of the loan" id="purpose" className="w-2/3 mt-1 p-2 w-full border rounded" />
                </div>
                <button id="mySubmitButton" type="submit" onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out">Submit</button>
              </form>
            )}

            { showForm && (
              <>
              <div className="flex flex-col items-center w-full p-2 border rounded text-sm text-slate-400">
                <div className="response-box">
                  <label className="flex text-slate-700 mb-1">JuicyScore Session ID</label>
                  <textarea readOnly value={juicySessionId?juicySessionId:''} rows="2" className=""></textarea>
                </div>
                <div className="response-box">
                  <label className="flex text-slate-700 mb-1">Request Payload</label>
                  <textarea readOnly value={requestPayload?requestPayload:''} rows="12" className=""></textarea>
                </div>
                <div className="response-box">
                  <label className="flex text-slate-700 mb-1">Alokta Response</label>
                  <textarea readOnly value={aloktaResponse?aloktaResponse:''} rows="12"></textarea>
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