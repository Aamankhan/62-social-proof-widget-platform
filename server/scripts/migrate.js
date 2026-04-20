const mongoose = require('mongoose');
require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialproof');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Create new collections
    await db.createCollection('orders');
    await db.createCollection('visitors');
    await db.createCollection('signups');
    await db.createCollection('livemessages');
    await db.createCollection('analytics');
    
    console.log('Collections created successfully');
    
    // Update existing widgets with default settings
    const widgets = db.collection('widgets');
    await widgets.updateMany(
      { fakeSettings: { $exists: false } },
      {
        $set: {
          mode: 'fake',
          fakeSettings: {
            names: ['Rahul', 'Anita', 'Priya', 'Amit'],
            cities: ['Delhi', 'Mumbai', 'Bangalore'],
            products: ['Shoes', 'Watch', 'Laptop'],
            messages: ['Limited stock!', 'Free shipping!'],
            minVisitors: 12,
            maxVisitors: 38,
            updateInterval: 5,
            displaySpeed: 3
          },
          realSettings: {
            apiEndpoint: '',
            webhookUrl: '',
            shopifyDomain: '',
            shopifyToken: '',
            woocommerceUrl: '',
            woocommerceKey: '',
            woocommerceSecret: ''
          }
        }
      }
    );
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();