import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JuicyPixel from './JuicyPixel';
import useStore from '../store/store'; // Adjust the path as necessary
import Logo from './Logo';

import Auth0Lock from 'auth0-lock';

function MainPage() {
  const { state } = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [requestPayload, setRequestPayload] = useState('');
  const [aloktaResponse, setAloktaResponse] = useState(false);

  const [userProfile, setUserProfile] = useState({}); // State to store user profile data

  const [geolocation, setGeolocation] = useState({}); // State to store geolocation data

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const juicySessionId = useStore((state) => state.juicySessionId);

  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTermChange = (e) => {
    setTerm(e.target.value);
  };

  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  const amountRef = useRef(null);
  const termRef = useRef(null);
  const purposeRef = useRef(null);

  useEffect(() => {
    // Fetch user profile data from /profile endpoint
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const profileData = await response.json();
        console.debug('User profile data:', profileData);
        setUserProfile(profileData); 
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
      
    };
    fetchUserProfile();
  }, []); 

  useEffect(() => {
    const _enableSubmit = (amount > 0) && (purpose.length > 0);

    console.log('Enable submit:', _enableSubmit);

    setIsSubmitEnabled(_enableSubmit);
  }, [amount, term, purpose]);
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const requestBody = {
      customer_id: userProfile?.app_metadata?.customer_id,
      customer_email: userProfile?.email,
      customer_phone: userProfile?.user_metadata?.phone_number,
      browser_time_local: new Date().toLocaleString(), // Local time in the default locale
      browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's timezone
      broswer_useragent: navigator.userAgent, // Browser version and details
      browser_platform: navigator.platform, // Type of device (e.g., MacIntel, Win32)
      browser_language: navigator.language, // Browser language (e.g., en-US)
      browser_location: geolocation,
      browser_connection_type: navigator.connection.type,
      browser_resolution: window.screen.width + 'x' + window.screen.height,
      juicyscore_session_id: juicySessionId,
      requested_loan_amount: amount,
      requested_loan_purpose: purpose,
      requested_loan_term: term,
    };

    setRequestPayload('Submitting, please wait...');
    setAloktaResponse('Submitting, please wait...')
    setFormSubmitted(true);

    try {
      const response = await fetch('/backend/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    
      // if (!response.ok) {
      //   const errorText = await response.text(); // Extracting text from the response body
      //   throw new Error(`Alokta decision response was not ok, status code ${response.status} details: ${errorText}`);
      // }
    
      const data = await response.json();

      setRequestPayload(JSON.stringify(data.request_to_alokta, null, 2));
      setAloktaResponse(JSON.stringify(data.alokta_response, null, 2));
      
    } catch (error) {
      console.error('Error submitting a request to Alokta:', error);

      setRequestPayload(error.toString());
      setAloktaResponse(error.toString());
    }
  }
  


  return (
    <>
      <Logo userProfile={userProfile}/>


      <div className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 mx-auto">
            {!showForm && (
              <button id="myFormButton" onClick={toggleForm} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out">I want to borrow cash</button>
            )}
            {showForm && (
              <form className="mt-4 p-6 bg-white rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <div className="font-semibold text-xl mb-4">Cash Loan Application</div>
                <div className="mb-4 flex items-center" >
                  <label htmlFor="amount" className="block w-2/3 text-sm font-medium text-gray-700">How much $ you are looking for:</label>
                  <input value={amount} onChange={handleAmountChange} type="number" placeholder="$ amount" id="amount" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>
                <div className="flex mb-4 items-center">
                  <label htmlFor="term" className="block w-1/3 text-sm font-medium text-gray-700">Term length:</label>
                  <select  value={term} onChange={handleTermChange} id="term" className="mt-1 p-2 w-2/3 border rounded">
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    {/* Additional options */}
                  </select>
                </div>
                <div className="flex mb-4 items-center">
                  <label htmlFor="purpose" className="block w-1/3 text-sm font-medium text-gray-700">Purpose:</label>
                  <input value={purpose} onChange={handlePurposeChange} type="text" placeholder="Purpose of the loan" id="purpose" className="w-2/3 mt-1 p-2 w-full border rounded" />
                </div>
                <button id="mySubmitButton" type="submit" onClick={handleSubmit} 
                  disabled={!isSubmitEnabled} 
                  className={
                      `${isSubmitEnabled ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-300'} 
                        px-4 py-2 text-white rounded transition duration-150 ease-in-out`}>Submit</button>
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
                  <label className="flex text-slate-700 mb-1">Request to Alokta</label>
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