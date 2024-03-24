const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => { // Changed from router.post to router.get
  try {
    const config = {
        juicyScoreDataApiKey: process.env.REACT_APP_JUICYSCORE_DATA_API_KEY,
      };
      res.json(config);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Error fetching configuration' });
  }
});

module.exports = router;
