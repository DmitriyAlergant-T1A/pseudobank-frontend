import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

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

  return (
    <div className="centered-content">
      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Bank Logo" className="App-logo" />
      <br/><br/>
      <p>Hello <b>{email}</b> (<b>{phoneNumber}</b>)</p>
      <p><button onClick={toggleForm}>I want to borrow cash</button></p>

      {showForm && (
        <form className="form-border" onSubmit={handleSubmit}>
            <span className="form-header">Cash Loan Application</span>
            <br/><br/>
            <div>
                <label htmlFor="amount">How much $ you are looking for: </label>
                <input type="number" placeholder="$ amount" id="amount" />
            </div>
            <br/>
            <div>
                <label htmlFor="term">Term length: </label>
                <select id="term">
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                {/* Additional options */}
                </select>
            </div>
            <br/>
            <div>
                <label htmlFor="purpose">Purpose: </label>
                <input type="text" placeholder="Purpose of the loan" id="purpose" />
            </div>
            <br/><br/>
            <button type="submit">Submit</button>
        </form>
      )}

      {formSubmitted && (
        <>
          <div className="response-box">
            <textarea placeholder="Request submitted to Alokta" rows="6"></textarea>
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
        </>
      )}
    </div>
  );
}

export default MainPage;