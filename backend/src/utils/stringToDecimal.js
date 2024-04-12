const crypto = require('crypto');


// Create a persistent (weak hash-like) decimal representation of a string

function stringToDecimal(str) {

  console.log("String to decimal: " + str);

  if (typeof str !== 'string' || str.length === 0) { // More accurate check for non-empty string
    console.error('Invalid input: Input must be a non-empty string.');
    return 0;
  }
  const hash = crypto.createHash('sha256').update(str).digest('hex').substring(0, 8);
  console.log("Hash: " + hash); 
  const decimal = parseInt(hash, 16);
  return decimal;
}

module.exports = { stringToDecimal };
