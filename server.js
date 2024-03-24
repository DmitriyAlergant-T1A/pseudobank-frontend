const express = require('express');
const cors = require('cors');
const path = require('path');
const decisionRouter = require('./backend/src/get_alokta_decision');
const configRouter = require('./backend/src/serve_config');


//load .env file
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 5500;

app.use('/backend/decision', decisionRouter);

app.use('/config', configRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
