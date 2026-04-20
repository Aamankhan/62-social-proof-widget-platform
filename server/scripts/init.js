const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Setting = require('../models/Setting');

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialproof';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if settings exist
    let settings = await Setting.findOne();
    
    if (!settings) {
      console.log('📝 No settings found. Creating default settings...');
      
      // Generate API key
      const apiKey = 'sp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      settings = new Setting({
        globalWidgetEnabled: true,
        domainWhitelist: ['*'],
        apiKey: apiKey,
        embedScriptVersion: '1.0.0',
        lastReset: new Date()
      });
      
      await settings.save();
      console.log('✅ Settings created successfully!');
      console.log('\n🔑 YOUR API KEY:', apiKey);
      console.log('📋 Save this API key in client/.env file as:');
      console.log(`VITE_API_KEY=${apiKey}\n`);
    } else {
      console.log('✅ Settings already exist');
      console.log('\n🔑 Current API Key:', settings.apiKey);
      console.log('📋 Use this API key in client/.env file as:');
      console.log(`VITE_API_KEY=${settings.apiKey}\n`);
    }
    
    // Create a test widget
    const Widget = require('../models/Widget');
    const widgetCount = await Widget.countDocuments();
    
    if (widgetCount === 0) {
      console.log('📝 Creating a sample widget...');
      const sampleWidget = new Widget({
        name: 'Sample Sales Widget',
        type: 'sales',
        message: 'Someone from {location} just purchased {product}',
        status: true,
        globalEnabled: true,
        position: 'bottom-right',
        themeSettings: {
          fontSize: '14px',
          buttonColor: '#3b82f6',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          borderRadius: '8px',
          shadowIntensity: 'soft',
          animation: 'slide'
        },
        rotationInterval: 5
      });
      await sampleWidget.save();
      console.log('✅ Sample widget created!');
    }
    
    // Create a sample notification
    const Notification = require('../models/Notification');
    const notificationCount = await Notification.countDocuments();
    
    if (notificationCount === 0) {
      console.log('📝 Creating sample notifications...');
      const sampleNotifications = [
        {
          text: 'Someone in Delhi just purchased Product X',
          location: 'Delhi',
          productName: 'Product X',
          customerName: 'Rahul',
          isActive: true
        },
        {
          text: '5 people are viewing this page',
          location: 'Live',
          isActive: true
        },
        {
          text: 'John from Mumbai just signed up',
          location: 'Mumbai',
          customerName: 'John',
          isActive: true
        }
      ];
      
      for (const notif of sampleNotifications) {
        const notification = new Notification(notif);
        await notification.save();
      }
      console.log('✅ Sample notifications created!');
    }
    
    console.log('\n🎉 Setup complete! You can now:');
    console.log('1. Start backend: npm run dev');
    console.log('2. Start frontend: cd ../client && npm run dev');
    console.log('3. Open browser at http://localhost:5173');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
};

initDatabase();