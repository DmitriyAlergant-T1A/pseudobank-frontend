import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import JuicyPixel from './JuicyPixel';
import useStore from '../store/store'; // Adjust the path as necessary
import Logo from './Logo';

import TextInputEntry from './FormElements/TextInputEntry';

import ReactJson from 'react-json-view';



import { PrepopulateButton, PrepopulateButtonsContainer } from './PrepopulateButton';

import prebuiltProfiles from '../store/prebuiltProfiles.js';

function PaydayLoanApplication() {

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [aloktaRequest, setAloktaRequest] = useState({});
  const [aloktaResponse, setAloktaResponse] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    socialNumber: '',
    amount: '',
    termDays: 7,
    purpose: '',
    reportedIncome: '',
    employmentOccupation: '',
    employmentEmployer: '',
    lengthOfEmploymentMonths: 36
  });

  const handleItemChange = useCallback((event) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [event.target.id]: event.target.value
    }));
  }, []); 


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
        && (formData.reportedIncome >= 0)
        && (formData.employmentOccupation.length > 0)
        && (formData.employmentEmployer.length > 0)
        && (formData.lengthOfEmploymentMonths >= -1)
        ;

    //console.log('Enable submit:', _enableSubmit);

    setIsSubmitEnabled(_enableSubmit);

    //setIsSubmitEnabled(true);
    
  }, [formData]);
 
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const requestBody = {
      browser_time_local: new Date().toLocaleString(), // Local time in the default locale
      browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's timezone
      browser_useragent: navigator.userAgent, // Browser version and details
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

    setAloktaRequest({"Submitting": "please wait..."});
    setAloktaResponse({});

    setFormSubmitted(true);

    try {

      const response = await fetch('/backend/decision/paydayloan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });


      if (response.status === 200)
      {
        const data = await response.json();

        setAloktaRequest(data.request_to_alokta);
        setAloktaResponse(data.alokta_response);
      }
      else
      {
        setAloktaRequest ({"Error submitting a request to Alokta": {"HTTP Response Code": response.status}});
        setAloktaResponse({"Error submitting a request to Alokta": {"HTTP Response Code": response.status}});
      }
    } catch (error) {
      console.error('Error submitting a request to Alokta:', error);

      setAloktaRequest({"ERROR":error.message});
      setAloktaResponse({"ERROR":error.message});
    }
  }

  
  return (
    <>
      <Logo />


      <div className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 mx-auto">
              <form className="mt-4 p-6 bg-white rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <div className="font-semibold text-xl mb-4">Payday Loan Application</div>

                <TextInputEntry
                  labeltext="Full Legal Name"
                  isMandatory={true}
                  placeholder="Gaius Julius Caesar"
                  id="fullName"
                  value={formData.fullName}
                  onChangeHandler={handleItemChange}
                />

                <TextInputEntry
                  labeltext="National ID#"
                  isMandatory={true}
                  placeholder="GJUI1204"
                  id="socialNumber"
                  value={formData.socialNumber}
                  onChangeHandler={handleItemChange}
                  onInputHandler={(e) => {
                    const regex = /^[A-Z]{4}\d{6}[H,M][A-Z]{5}\d{2}$/;
                    if (regex.test(e.target.value)) {
                      e.target.classList.add('border-green-500', 'focus:bg-green-100');
                      e.target.classList.remove('border-red-500', 'focus:bg-red-100');
                    } else {
                      e.target.classList.add('border-red-500', 'focus:bg-red-100');
                      e.target.classList.remove('border-green-500', 'focus:bg-green-100');
                    }
                  }}
                />

                <TextInputEntry
                  labeltext="Email Address"
                  isMandatory={true}
                  placeholder="caesar@romanempire.it"
                  id="email"
                  value={formData.email}
                  onChangeHandler={handleItemChange}
                />

                <TextInputEntry 
                  labeltext="Your Phone Number"
                  isMandatory={true}
                  placeholder="123456789"
                  id="phone"
                  value={formData.phone}
                  onChangeHandler={handleItemChange}
                  onInputHandler={(e) => e.target.value = e.target.value.replace(/\D/g, '')} 
                />

                {/* Amount */}
                <div className="mb-4 flex items-center" >
                  <div className={`block w-2/3`}>
                      <label className="text-sm font-medium text-red-700 mr-1">*</label>
                      <label className="text-sm font-medium text-gray-700">How much $ you are looking for:</label>
                  </div>
                  <input value={formData.amount} onChange={handleItemChange} type="number" placeholder="$ loan amount" id="amount" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>

                {/* Term */}
                <div className="flex mb-4 items-center">
                  <div className={`block w-2/3`}>
                      <label className="text-sm font-medium text-red-700 mr-1">*</label>
                      <label className="text-sm font-medium text-gray-700">Term Length</label>
                  </div>                
                  <select  value={formData.termDays} onChange={handleItemChange} id="termDays" className="mt-1 p-2 w-2/3 border rounded">
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                    <option value="92">3 Months</option>
                    <option value="182">6 Months</option>
                  </select>
                </div>

                <TextInputEntry
                  labeltext="Purpose of the Loan"
                  isMandatory={true}
                  placeholder="Purpose of the loan"
                  id="purpose"
                  value={formData.purpose}
                  onChangeHandler={handleItemChange}
                />
                
                {/* Income */}
                <div className="mb-4 flex items-center" >
                  <div className={`block w-2/3`}>
                    <label className="text-sm font-medium text-red-700 mr-1">*</label>
                    <label className="text-sm font-medium text-gray-700">Your average monthly income:</label>
                  </div>
                  <input value={formData.reportedIncome} onChange={handleItemChange} type="number" placeholder="$ income" id="reportedIncome" className="w-1/3 mt-1 p-2 w-full border rounded" />
                </div>

                <TextInputEntry 
                  labeltext="Source of Income, occupation"
                  isMandatory={true}
                  placeholder="Street vendor..."
                  id="employmentOccupation"
                  value={formData.employmentOccupation}
                  onChangeHandler={handleItemChange}
                />

                <TextInputEntry
                  labeltext="Employer"
                  isMandatory={true}
                  placeholder="n/a (self-employed)"
                  id="employmentEmployer"
                  value={formData.employmentEmployer}
                  onChangeHandler={handleItemChange}
                />

                {/* Length of Employment */}
                <div className="flex mb-4 items-center">
                  <div className={`block w-2/3`}>
                    <label className="text-sm font-medium text-red-700 mr-1">*</label>
                    <label className="text-sm font-medium text-gray-700">Length of employment with the current employer</label>
                  </div>
                  <select  value={formData.lengthOfEmploymentMonths} onChange={handleItemChange} id="lengthOfEmploymentMonths" className="mt-1 p-2 w-2/3 border rounded">
                    <option value="-1">Not currently employed</option>
                    <option value="0">Just started</option>
                    <option value="1">1-3 months</option>
                    <option value="4">4-12 months</option>  
                    <option value="12">1-3 years</option>
                    <option value="36" default>4+ years</option>
                  </select>
                </div>
                
                {/* Submit Button */}
                <button id="mySubmitButton" type="submit" onClick={handleSubmit} 
                  disabled={!isSubmitEnabled} 
                  className={
                      `${isSubmitEnabled ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-300'} 
                        px-4 py-2 text-white rounded transition duration-150 ease-in-out`}>Submit</button>
              </form>

              <>
              { formSubmitted && (
                <div className="flex flex-col items-center w-full p-2 border rounded text-sm text-slate-400">
                  <div className="response-box border border-gray-500 border-1 border-opacity-30 p-2">
                    <label className="flex text-slate-700 mb-1">JuicyScore Session ID (pixel embedded on this front-end page)</label>
                    <textarea readOnly value={juicySessionId?juicySessionId:''} rows="2" className=""></textarea>
                  </div>
                  <div className="response-box border border-gray-500 border-1 border-opacity-30 p-2">
                    <label className="flex text-slate-700 mb-1">Pseudobank Back-End request to Alokta</label>
                    <ReactJson src={aloktaRequest?aloktaRequest:{}} theme="rjv-default" collapsed={false} displayDataTypes={false} name={false} displayObjectSize={false} enableClipboard={false}/>
                  </div>
                  <div className="response-box border border-gray-500 border-1 border-opacity-30 p-2">
                    <label className="flex text-slate-700 mb-1">Alokta Response</label>
                    <ReactJson src={aloktaResponse?aloktaResponse:{}} theme="vscodeTheme" collapsed={false} displayDataTypes={false} name={false} displayObjectSize={false} enableClipboard={false}/>
                  </div>
                </div> )
              }
              </>
      </div>
      <PrepopulateButtonsContainer>
        {prebuiltProfiles.map((profile, index) => (
          <PrepopulateButton
            key={index}
            profileData={profile}
            setFormData={setFormData}
            label={`Profile ${index + 1}`}
          />
        ))}
      </PrepopulateButtonsContainer>
      <JuicyPixel />
    </>
  );
}

export default PaydayLoanApplication;