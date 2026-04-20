const mongoose = require('mongoose');
require('dotenv').config();

const checkApiKey = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialproof';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Check settings collection
    const db = mongoose.connection.db;
    const settings = await db.collection('settings').findOne();
    
    if (settings) {
      console.log('📋 Settings found in database:');
      console.log('API Key:', settings.apiKey);
      console.log('Global Enabled:', settings.globalWidgetEnabled);
      console.log('Domain Whitelist:', settings.domainWhitelist);
      console.log('\n✅ Use this API key in your client/.env file:');
      console.log(`VITE_API_KEY=${settings.apiKey}`);
    } else {
      console.log('❌ No settings found in database!');
      console.log('Run: node scripts/init.js to create settings');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkApiKey();