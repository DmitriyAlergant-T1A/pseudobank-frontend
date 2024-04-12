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

router.post('/', async (req, res) => {
    // Get the access token
    const accessToken = await getAccessToken();
    console.log("Successfully authorized to Alokta, got an access token");


    const aloktaRequest = {
      "customer_email": req.body.customer_email,
      "customer_phone": "123456",
      "customer_id": stringToDecimal(req.body.customer_email).toString(),
      "application_id":Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      "browser_useragent":req.userAgent,
      "browser_ip":req.ip,
      // "browser_platform": req.body.browser_platform,
      // "browser_language": req.body.browser_language,
      // "browser_resolution": req.body.browser_resolution,
      // "browser_location": req.body.browser_location,  
      "requested_loan_amount": req.body.requested_loan_amount,
      "requested_loan_purpose": req.body.requested_loan_purpose,
      "requested_loan_term": req.body.requested_loan_term,
    }
    console.log("Prepared Alokta decision request: " + JSON.stringify(aloktaRequest, null, 2));

    try {
      const diagramId = process.env.ALOKTA_DECISION_DIAGRAM_ID
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

      const data = await response.json();

      console.log("Alotka decision response: " + JSON.stringify(data, null, 2));

      res.json(
        {
          "request_to_alokta": aloktaRequest,
          "alokta_response": data,
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
});

module.exports = router;
