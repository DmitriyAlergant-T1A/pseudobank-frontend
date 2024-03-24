const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("Requesting Alokta decision from: " + process.env.ALOKTA_API_URL)

    const response = await fetch(process.env.ALOKTA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.ALOKTA_DECISION_AUTH_KEY,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error('Alokta decision response was not ok, status code ' + response.status);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error submitting a request to Alokta:', error);
    res.status(500).json({ error: 'Error submitting a request to Alokta' });
  }
});

module.exports = router;
