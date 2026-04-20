const crypto = require('crypto');

const generateApiKey = () => {
  return 'sp_' + crypto.randomBytes(32).toString('hex');
};

module.exports = { generateApiKey };