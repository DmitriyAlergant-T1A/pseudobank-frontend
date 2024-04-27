import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JuicyPixel from './JuicyPixel';
import useStore from '../store/store'; // Adjust the path as necessary
import Logo from './Logo';

import Auth0Lock from 'auth0-lock';

function PaydayLoanApplication() {
  const { state } = useLocation();

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [aloktaRequest, setAloktaRequest] = useState('');
  const [aloktaResponse, setAloktaResponse] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    socialNumber: '',
    amount: '',
    termDays: 7,
    purpose: '',
    reportedIncome: '',
    employmentOccupation: '',
    employmentEmployer: '',
    lengthOfEmploymentMonths: ''
    // Add new form fields here as needed
  });

  const handleItemChange = (e) => {

    const { id, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));

    //console.log('Form data:', formData);
  };

  const setConfig = useStore((state) => state.setConfig);
  const juicySessionId = useStore((state) => state.juicySessionId);

  useEffect(() => {
    console.log("Fetching /config")

    fetch('/config')
      .then((response) => response.json())
      .then((configData) => {
        setConfig(configData);
      });
  }, [setConfig]);

  useEffect(() => {
    const _enableSubmit = 
        (formData.amount > 0) 
        && (formData.purpose.length > 0)
        && (formData.termDays > 0)
        && (formData.fullName.length > 0)
        && (formData.socialNumber.length > 0)
        && (formData.reportedIncome > 0)
        && (formData.employmentOccupation.length > 0)
        && (formData.employmentEmployer.length > 0)
        && (formData.lengthOfEmploymentMonths > 0)
        ;

    //console.log('Enable submit:', _enableSubmit);

    //setIsSubmitEnabled(_enableSubmit);

    setIsSubmitEnabled(true);
    
  }, [formData]);

  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const requestBody = {
      browser_time_local: new Date().toLocaleString(), // Local time in the default locale
      browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's timezone
      broswer_useragent: navigator.userAgent, // Browser version and details
      browser_platform: navigator.platform, // Type of device (e.g., MacIntel, Win32)
      browser_language: navigator.language, // Browser language (e.g., en-US)
      browser_connection_type: navigator.connection.type,
      browser_resolution: window.screen.width + 'x' + window.screen.height,
      juicyscore_session_id: juicySessionId,
      requested_loan_amount: formData.amount,
      requested_loan_purpose: formData.purpose,
      requested_loan_term: formData.term,
      customer_full_name: formData.fullName,
      customer_social_insurance_number: formData.socialNumber,
      customer_id: undefined,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_reported_income: formData.reportedIncome,
      customer_employment_occupation: formData.employmentOccupation,
      customer_employment_employer: formData.employmentEmployer,
      customer_length_of_employment_months: formData.lengthOfEmploymentMonths,
    };

    setAloktaRequest('Submitting, please wait...');
    setAloktaResponse('Submitting, please wait...')

    setFormSubmitted(true);

    try {
      const response = await fetch('/backend/decision/paydayloan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      setAloktaRequest(JSON.stringify(data.request_to_alokta, null, 2));
      setAloktaResponse(JSON.stringify(data.alokta_response, null, 2));
      
    } catch (error) {
      console.error('Error submitting a request to Alokta:', error);

      setAloktaRequest(error.toString());
      setAloktaResponse(error.toString());
    }
  }

  return (
    <>
      <Logo />


      <div className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 mx-auto">
              <form className="mt-4 p-6 bg-white rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <div className="font-semibold text-xl mb-4">Payday Loan Application</div>

                {/* Full Name */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Full Legal Name</label>
                  <input value={formData.fullName}  onChange={handleItemChange} type="text" placeholder="Gaius Julius Caesar" id="fullName" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>


                {/* Social */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Your Social Insurance Number</label>
                  <input value={formData.socialNumber}  onChange={handleItemChange} type="text" placeholder="123..."  id="socialNumber" className="w-1/3 mt-1 p-2 w-full border rounded" 
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}   />
                </div>

                {/* Email */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Your Email</label>
                  <input value={formData.email}  onChange={handleItemChange} type="text" placeholder="caesar@romanempire.it" id="email" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>

                {/* Phone Number */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Your Phone Number</label>
                  <input value={formData.phone}  onChange={handleItemChange} type="text" placeholder="123456789" id="phone" className="w-1/3 mt-1 p-2 w-full border rounded"
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}  />
                </div>

                {/* Amount */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">How much $ you are looking for:</label>
                  <input value={formData.amount} onChange={handleItemChange} type="number" placeholder="$ loan amount" id="amount" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>

                {/* Term */}
                <div className="flex mb-4 items-center">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">Term length:</label>
                  <select  value={formData.termDays} onChange={handleItemChange} id="termDays" className="mt-1 p-2 w-2/3 border rounded">
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                    <option value="92">3 Months</option>
                    <option value="182">6 Months</option>
                  </select>
                </div>

                {/* Purpose */}
                <div className="flex mb-4 items-center">
                  <label className="block w-1/3 text-sm font-medium text-gray-700">Purpose:</label>
                  <input value={formData.purpose} onChange={handleItemChange} type="text" placeholder="Purpose of the loan" id="purpose" className="w-2/3 mt-1 p-2 w-full border rounded" />
                </div>

                {/* Income */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Your average monthly income:</label>
                  <input value={formData.reportedIncome} onChange={handleItemChange} type="number" placeholder="$ income" id="reportedIncome" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>

                {/* Employment Occupation */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Source of Income, occupation:</label>
                  <input value={formData.employmentOccupation} onChange={handleItemChange} type="text" placeholder="Street vendor..." id="employmentOccupation" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>

                {/* Employer */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Employer:</label>
                  <input value={formData.employmentEmployer} onChange={handleItemChange} type="text" placeholder="n/a (self)" id="employmentEmployer" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>

                {/* Length of Employment */}
                <div className="mb-4 flex items-center" >
                  <label className="block w-2/3 text-sm font-medium text-gray-700">Length of employment in the current occupation (months)</label>
                  <input value={formData.lengthOfEmploymentMonths} onChange={handleItemChange} type="number" placeholder="36 months" id="lengthOfEmploymentMonths" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>
                

                {/* Submit Button */}
                <button id="mySubmitButton" type="submit" onClick={handleSubmit} 
                  disabled={!isSubmitEnabled} 
                  className={
                      `${isSubmitEnabled ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-300'} 
                        px-4 py-2 text-white rounded transition duration-150 ease-in-out`}>Submit</button>
              </form>

              <>
              <div className="flex flex-col items-center w-full p-2 border rounded text-sm text-slate-400">
                <div className="response-box">
                  <label className="flex text-slate-700 mb-1">JuicyScore Session ID</label>
                  <textarea readOnly value={juicySessionId?juicySessionId:''} rows="2" className=""></textarea>
                </div>
                <div className="response-box">
                  <label className="flex text-slate-700 mb-1">Request to Alokta</label>
                  <textarea readOnly value={aloktaRequest?aloktaRequest:''} rows="12" className=""></textarea>
                </div>
                <div className="response-box">
                  <label className="flex text-slate-700 mb-1">Alokta Response</label>
                  <textarea readOnly value={aloktaResponse?aloktaResponse:''} rows="12"></textarea>
                </div>
              </div>
              </>
      </div>
      <JuicyPixel />
    </>
  );
}

export default PaydayLoanApplication;