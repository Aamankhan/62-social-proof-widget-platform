const mongoose = require('mongoose');
require('dotenv').config();

const fixWhitelist = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialproof';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('settings');
    
    // Update whitelist to allow all domains (for development)
    const result = await collection.updateOne(
      {}, 
      { 
        $set: { 
          domainWhitelist: ['*'],
          globalWidgetEnabled: true
        } 
      }
    );
    
    console.log('✅ Domain whitelist updated!');
    console.log('Current settings:');
    
    const settings = await collection.findOne({});
    console.log('Domain Whitelist:', settings.domainWhitelist);
    console.log('Global Enabled:', settings.globalWidgetEnabled);
    console.log('API Key:', settings.apiKey);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixWhitelist();