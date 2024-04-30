const express = require('express');
const cors = require('cors');
const path = require('path');
const decisionRouter = require('./backend/src/get_alokta_decision');
const configRouter = require('./backend/src/serve_config');
const { auth, requiresAuth } = require('express-openid-connect');

// Load .env file
require('dotenv').config();

const authConfig = {
  authRequired: false, // Important: Set to false to not require auth for all routes
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.OIDC_BASEURL,
  clientID: process.env.OIDC_CLIENTID,
  issuerBaseURL: process.env.OIDC_ISSUERBASEURL
};

const app = express();
app.use(cors());
app.use(express.json());



// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// This route will not use authentication, since some of our forms (Payday Loan) are pre-auth
app.use('/backend/decision', decisionRouter);

// Initialize Auth0 if needed
if (process.env.AUTH_AUTH0 === 'Y') {
  app.use(auth(authConfig));
}

// Public API Routes
app.use('/config', configRouter);

// Profile route as an example of a protected route
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req?.oidc?.user));
});

// Handle React routing, return all requests to React app
// This catch-all route should be defined after all other API and Auth routes
app.get('*', (req, res) => {
  // Serve index.html for any unknown paths
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.SERVER_PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
