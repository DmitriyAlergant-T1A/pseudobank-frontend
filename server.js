const express = require('express');
const cors = require('cors');
const path = require('path');

const decisionRouter = require('./backend/src/get_alokta_decision');
const configRouter = require('./backend/src/serve_config');

const { auth, requiresAuth } = require('express-openid-connect');

//load .env file
require('dotenv').config();

const authConfig = {
  authRequired: true,
  //auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.OIDC_BASEURL,
  clientID: process.env.OIDC_CLIENTID,  
  issuerBaseURL: process.env.OIDC_ISSUERBASEURL
};

// Middleware to conditionally apply authentication
const conditionalAuth = (req, res, next) => {
  if (process.env.AUTH_AUTH0 === 'Y') {
    requiresAuth()(req, res, next);
  } else {
    next();
  }
};

const app = express();
app.use(cors());
app.use(express.json());

// auth router attaches /login, /logout, and /callback routes to the baseURL
if (process.env.AUTH_AUTH0 === 'Y') {
  app.use(auth(authConfig));
}

const PORT = process.env.SERVER_PORT || 5500;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('/', conditionalAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/backend/decision', conditionalAuth, decisionRouter);

app.use('/config', conditionalAuth, configRouter);

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
