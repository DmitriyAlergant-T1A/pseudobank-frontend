const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Read the prebuiltProfiles from the file
const prebuiltProfilesPath = path.join(__dirname, '../../src/store/prebuiltProfiles.js');
const prebuiltProfilesContent = fs.readFileSync(prebuiltProfilesPath, 'utf8');

// Extract the array from the file content
const prebuiltProfilesMatch = prebuiltProfilesContent.match(/const prebuiltProfiles = (\[[\s\S]*?\]);/);
const prebuiltProfiles = prebuiltProfilesMatch ? eval(prebuiltProfilesMatch[1]) : [];

router.get('/', async (req, res) => {
  try {
    // Use the first prebuilt profile
    const testProfile = prebuiltProfiles[0];

    const testRequest = {
      browser_time_local: new Date().toLocaleString(),
      browser_timezone: 'UTC',
      browser_useragent: 'HealthCheck/1.0',
      browser_platform: 'HealthCheck',
      browser_language: 'en-US',
      browser_connection_type: 'unknown',
      browser_resolution: '1920x1080',
      juicyscore_session_id: 'healthcheck-session',
      customer_full_name: testProfile.fullName,
      customer_social_insurance_number: testProfile.socialNumber,
      customer_id: 'healthcheck-id',
      customer_email: testProfile.email,
      customer_phone: testProfile.phone,
      customer_reported_income: testProfile.reportedIncome,
      customer_employment_occupation: testProfile.employmentOccupation,
      customer_employment_employer: testProfile.employmentEmployer,
      customer_length_of_employment_months: testProfile.lengthOfEmploymentMonths,
      item_vendor: 'Pseudoshop',
      item_name: 'Iphone 15 Pro',
      item_total_cost: 999,
      loan_term_months: 24,
      monthly_installment_amount: 45,
      requested_loan_purpose: testProfile.purpose,
      support_chat_messages: []
    };

    const response = await fetch(`http://localhost:${process.env.SERVER_PORT || 5500}/backend/decision/bnpl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data.alokta_response && data.alokta_response.alokta_decision) {
        res.status(200).json({ 
          status: 'OK', 
          message: 'BNPL decision endpoint is working correctly',
          alokta_decision: data.alokta_response.alokta_decision
        });
      } else {
        res.status(500).json({ status: 'Error', message: 'BNPL decision endpoint returned unexpected data' });
      }
    } else {
      res.status(500).json({ status: 'Error', message: 'BNPL decision endpoint returned non-200 status' });
    }
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'Error', message: 'Health check failed', error: error.message });
  }
});

module.exports = router;
