const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("Requesting Alokta decision from: " + process.env.ALOKTA_API_URL)
    console.log("Auth Key: " + process.env.ALOKTA_DECISION_AUTH_KEY)

    const response = await fetch(process.env.ALOKTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.ALOKTA_DECISION_AUTH_KEY,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      // Improved error handling with response details
      const errorDetails = await response.text(); // Assuming the error details are in text format
      throw new Error(`Alokta decision response was not ok, status code ${response.status}, details: ${errorDetails}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error submitting a request to Alokta:', error);
    // Improved error reporting to client with error details
    res.status(500).json({
      error: 'Pseudobank-backend: error submitting a request to Alokta',
      message: error.message,
      details: error.details || null // Include additional details if available
    });
  }
});

module.exports = router;
