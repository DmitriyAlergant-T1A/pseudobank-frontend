const express = require('express');
const fetch = require('node-fetch');
const { stringToDecimal } = require('./utils/stringToDecimal'); 

const router = express.Router();

// Function to get the access token
async function getAccessToken() {
  const response = await fetch(`${process.env.ALOKTA_API_URL_AUTH_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.ALOKTA_API_AUTH_CLIENTID}:`).toString('base64')}`
    },
    body: `grant_type=password&username=${process.env.ALOKTA_API_AUTH_USERNAME}&password=${process.env.ALOKTA_API_AUTH_PASSWORD}`
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to obtain access token, status code ${response.status}, details: ${errorDetails}`);
  }

  const data = await response.json();
  return data.access_token;
}

router.post('/cashloan', async (req, res) => {

    const aloktaRequest = {
      "juicyscore_session_id":  req.body.juicyscore_session_id,
      "application_id":Math.floor(1000000000 + Math.random() * 9000000000).toString(),

      "channel": "site",

      "browser_useragent":req.body.browser_useragent,
      "browser_ip":req.ip,
      "browser_platform": req.body.browser_platform,
      "browser_language": req.body.browser_language,
      "browser_connection_type": req.body.browser_connection_type,
      "browser_timezone": req.body.browser_timezone,
      "browser_time_local": req.body.browser_time_local,

      "requested_loan_amount": req.body.requested_loan_amount,
      "requested_loan_purpose": req.body.requested_loan_purpose,
      "requested_loan_term": req.body.requested_loan_term,

      "customer_email": req.body.customer_email,
      "customer_phone": "123456",
      "customer_id": stringToDecimal(req.body.customer_email).toString(),
    }
    console.log("Prepared Alokta decision request for Cash Loan: " + JSON.stringify(aloktaRequest, null, 2));

    getAloktaDecision(aloktaRequest, process.env.ALOKTA_DECISION_DIAGRAM_ID_CASHLOAN, res);
});


router.post('/paydayloan', async (req, res) => {

  const aloktaRequest = {
    "juicyscore_session_id":  req.body.juicyscore_session_id,
    "application_id":Math.floor(1000000000 + Math.random() * 9000000000).toString(),

    "channel": "site",

    "browser_useragent":req.body.browser_useragent,
    'browser_platform': req.body.browser_platform,
    "browser_ip":req.ip,
    "browser_timezone": req.body.browser_timezone,
    "browser_time_local": req.body.browser_time_local,
    "browser_language": req.body.browser_language,
    "browser_connection_type": req.body.browser_connection_type,
    
    "requested_loan_amount": req.body.requested_loan_amount,
    "requested_loan_purpose": req.body.requested_loan_purpose,
    "requested_loan_term": req.body.requested_loan_term,

    "customer_full_name": req.body.customer_full_name,
    "customer_social_insurance_number": req.body.customer_social_insurance_number,
    "customer_id": stringToDecimal(req.body.customer_email).toString(),
    "customer_email": req.body.customer_email,
    "customer_phone": req.body.customer_phone,
    "customer_reported_income": req.body.customer_reported_income,
    "customer_employment_occupation": req.body.customer_employment_occupation,
    "customer_employment_employer": req.body.customer_employment_employer,
    "customer_length_of_employment_months": req.body.customer_length_of_employment_months
  }
  console.log("Prepared Alokta decision request for Payday Loan: " + JSON.stringify(aloktaRequest, null, 2));

  getAloktaDecision(aloktaRequest, process.env.ALOKTA_DECISION_DIAGRAM_ID_PAYDAY, res);
});

router.post('/bnpl', async (req, res) => {

  const aloktaRequest = {
    "juicyscore_session_id":  req.body.juicyscore_session_id,
    "application_id":Math.floor(1000000000 + Math.random() * 9000000000).toString(),

    "channel": "site",

    "browser_useragent":req.body.browser_useragent,
    'browser_platform': req.body.browser_platform,
    "browser_ip":req.ip,
    "browser_timezone": req.body.browser_timezone,
    "browser_time_local": req.body.browser_time_local,
    "browser_language": req.body.browser_language,
    "browser_connection_type": req.body.browser_connection_type,
    
    "customer_full_name": req.body.customer_full_name,
    "customer_social_insurance_number": req.body.customer_social_insurance_number,
    "customer_id": stringToDecimal(req.body.customer_email).toString(),
    "customer_email": req.body.customer_email,
    "customer_phone": req.body.customer_phone,
    "customer_reported_income": req.body.customer_reported_income,
    "customer_employment_occupation": req.body.customer_employment_occupation,
    "customer_employment_employer": req.body.customer_employment_employer,
    "customer_length_of_employment_months": req.body.customer_length_of_employment_months,

    "item_vendor":                req.body.item_vendor,
    "item_name":                  req.body.item_name,  
    "item_total_cost":            req.body.item_total_cost,
    "loan_term_months":           req.body.loan_term_months,
    "monthly_installment_amount": req.body.monthly_installment_amount,
    "requested_loan_purpose":       req.body.requested_loan_purpose
  }
  console.log("Prepared Alokta decision request for BNPL Loan: " + JSON.stringify(aloktaRequest, null, 2));

  getAloktaDecision(aloktaRequest, process.env.ALOKTA_DECISION_DIAGRAM_ID_BNPL, res);
});


  async function getAloktaDecision(aloktaRequest, diagramId, res) {

    const accessToken = await getAccessToken();
    console.log("Successfully authorized to Alokta, got an access token");

    try {
      const diagramUrl = process.env.ALOKTA_API_URL_DECISION + "/" + diagramId
      console.log("Requesting Alokta decision from: " + diagramUrl);
      
      const response = await fetch(diagramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(aloktaRequest)
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Alokta decision response was not ok, status code ${response.status}, details: ${errorDetails}`);
      }

      const alokta_response = await response.json();

      console.log("Alokta decision response: " + JSON.stringify(alokta_response, null, 2));

      if (diagramId.includes("bnpl")) //BNPL - response massaging
        res.json(
          {
            "request_to_alokta": aloktaRequest,
            "alokta_response": 
            {
              "alokta_decision": alokta_response?.out_alokta_decision,
              "alokta_risk_score": alokta_response?.out_alokta_risk_score,
              "alokta_ai_evaluation": alokta_response?.out_alokta_ai_evaluation,
              "partner_scores": alokta_response?.out_partner_scores?.map(item =>     ({Key: item?.Key, Value: item?.Value})),
              "other_predictors": alokta_response?.out_other_predictors?.map(item => ({Key: item?.Key, Value: item?.Value}))
            }
          });
      else                              //Payday, Cash loans - response massaging not implemented yet
      res.json(
        {
          "request_to_alokta": aloktaRequest,
          "alokta_response": alokta_response
        });       

    } catch (error) {
      console.error('Error submitting a request to Alokta:', error);
      res.status(500).json({
        "request_to_alokta": aloktaRequest,
        "alokta_response": 
        {
          error: 'Error submitting a request to Alokta',
          message: error.message,
          details: error.details || null
        }
      });
    }
};

module.exports = router;
