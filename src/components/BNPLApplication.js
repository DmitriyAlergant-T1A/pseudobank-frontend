import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import JuicyPixel from './JuicyPixel';
import useStore from '../store/store'; // Adjust the path as necessary
import Logo from './Logo';

import TextInputEntry from './FormElements/TextInputEntry';

import PseudobankDeepChat from './PseudobankDeepChat.js';

import ReactJson from 'react-json-view';
import Modal from 'react-modal';


import { PrepopulateButton, PrepopulateButtonsContainer } from './PrepopulateButton';

import prebuiltProfiles from '../store/prebuiltProfiles.js';

function BNPLApplication() {

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [isWaitingForDecision, setIsWaitingForDecision] = useState(false);

  const [aloktaRequest, setAloktaRequest] = useState({});

  const [aloktaResponse, setAloktaResponse] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const chatElementRef = useRef(null);


  const [formData, setFormData] = useState({
    fullName: '',
    socialNumber: '',
    reportedIncome: '',
    employmentOccupation: '',
    employmentEmployer: '',
    lengthOfEmploymentMonths: 36
  });

  const [bnplData, setBnplData] = useState({
    item_vendor: 'Pseudoshop',
    item_name: 'Iphone 15 Pro',
    item_total_cost: 999,
    monthly_installment_amount: 45,
    loan_term_months: 24
  })

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
        true
        && (formData.fullName.length > 0)
        && (formData.socialNumber.length > 0)
        && (formData.reportedIncome >= 0)
        && (formData.employmentOccupation.length > 0)
        && (formData.employmentEmployer.length > 0)
        && (formData.lengthOfEmploymentMonths >= -1)
        ;

    setIsSubmitEnabled(_enableSubmit);   
  }, [formData]);

  useEffect( () => {
    const socialNumberInput = document.getElementById('socialNumber');

    const checkSSNFormat = (inputField) => 
    {
      const regex = /^[A-Z]{4}\d{6}[H,M][A-Z]{5}\d{2}$/;
                          if (regex.test(inputField.value)) {
                            inputField.classList.add('border-green-500', 'focus:bg-green-100');
                            inputField.classList.remove('border-red-500', 'focus:bg-red-100');
                          } else {
                            inputField.classList.add('border-red-500', 'focus:bg-red-100');
                            inputField.classList.remove('border-green-500', 'focus:bg-green-100');
                          }
    }
    
    checkSSNFormat(socialNumberInput)

  }, [formData.socialNumber])

  const getChatMessages = () => {
    if (chatElementRef.current) {
      const messages = chatElementRef.current.getMessages();
      console.log("Support Chat Messages: ",  messages);

      return messages;
    }
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    let supportChatMessages = getChatMessages();
  
    const requestBody = {
      browser_time_local: new Date().toLocaleString(), // Local time in the default locale
      browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's timezone
      browser_useragent: navigator.userAgent, // Browser version and details
      browser_platform: navigator.platform, // Type of device (e.g., MacIntel, Win32)
      browser_language: navigator.language, // Browser language (e.g., en-US)
      browser_connection_type: navigator.connection.type,
      browser_resolution: window.screen.width + 'x' + window.screen.height,
      juicyscore_session_id: juicySessionId,
      customer_full_name: formData.fullName,
      customer_social_insurance_number: formData.socialNumber,
      customer_id: undefined,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_reported_income: formData.reportedIncome,
      customer_employment_occupation: formData.employmentOccupation,
      customer_employment_employer: formData.employmentEmployer,
      customer_length_of_employment_months: formData.lengthOfEmploymentMonths,
      item_vendor: bnplData.item_vendor,
      item_name: bnplData.item_name,
      item_total_cost: bnplData.item_total_cost,
      loan_term_months: bnplData.loan_term_months,
      monthly_installment_amount: bnplData.monthly_installment_amount,
      requested_loan_purpose: `E-Commerce Buy Now Pay later, buying an ${bnplData['item_name']} at ${bnplData['item_vendor']} for monthly installment payments of $${bnplData['monthly_installment_amount']} for ${bnplData['loan_term_months']} months`,
      support_chat_messages: supportChatMessages
    };

    console.log(JSON.stringify(requestBody, null, 2));


    setAloktaRequest({"Submitting": "please wait..."});
    setAloktaResponse({});

    setIsFormSubmitted(true);
    setIsModalOpen(true);
    setIsWaitingForDecision(true);

    try {

      const response = await fetch('/backend/decision/bnpl', {
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
    finally {
      setIsWaitingForDecision(false);
    }
  }
  
  return (
    <>
      <Logo />

      <div className="w-full flex flex-col w-full items-center justify-start min-h-screen bg-gray-100 p-4 mx-auto">

              <form className="mt-4 p-6 bg-white rounded shadow-md w-full max-w-2xl" onSubmit={handleSubmit}>
               
                  <div className="flex">

                    <div className="flex-col w-3/4">

                        <div className="font-semibold text-xl flex">
                          Buy Now and Pay Later
                        </div>

                        <div className="flex-col px-6 py-2 max-w-md">

                            <div className="flex items-center p-1">
                                <div className="block w-1/2 font-semibold">Vendor</div>
                                <div className="flex text-blue-700">{bnplData['item_vendor']}</div>
                            </div>

                            <div className="flex items-center p-1">
                                <div className="block w-1/2 font-semibold">Item:</div>
                                <div className="flex text-blue-700">{bnplData['item_name']}</div>
                            </div>

                            <div className="flex items-center p-1">
                                <div className="block w-1/2 font-semibold">Full Price:</div>
                                <div className="flex text-blue-700">${bnplData['item_total_cost']}</div>
                            </div>

                            <div className="flex items-center p-1">
                                <div className="block w-1/2 font-semibold">Monthly Payment:</div>
                                <div className="flex text-blue-700">${bnplData['monthly_installment_amount']} monthly</div>
                            </div>

                            <div className="flex items-center p-1">
                                <div className="block w-1/2 font-semibold">Loan Term:</div>
                                <div className="flex text-blue-700">{bnplData['loan_term_months']} months</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-1/4 items-center justify-center">
                      <img src="iphone_15_small.webp"/>
                    </div>

                  </div>
                                  
                <div className="flex font-semibold text-xl my-4">
                  Please give us a few details...
                </div>

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
              { isFormSubmitted && (
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto text-center flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Alokta Decision</h2>
          <p className="text-lg">
            {
              (isWaitingForDecision) ? (
                `Please wait...` 
              )
              : (aloktaResponse?.alokta_decision == 'Approved' || aloktaResponse?.alokta_decision == 'Accept') ? (
                <span className="text-green-700 font-semibold">APPROVED</span>
              ) 
              : (aloktaResponse?.alokta_decision == 'Rejected' || aloktaResponse?.alokta_decision == 'Reject' || aloktaResponse?.alokta_decision == 'Decline') ? (
                <span className="text-red-700 font-semibold">REJECTED</span>
              ) 
              : (
                `Unexpected decision: "${aloktaResponse?.alokta_decision}"`
              )
            }
          </p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </Modal>
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
      <PseudobankDeepChat chatElementRef={chatElementRef} />      
    </>
  );
}

export default BNPLApplication;