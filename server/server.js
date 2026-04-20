const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const widgetRoutes = require('./routes/widgets');
const notificationRoutes = require('./routes/notifications');
const settingsRoutes = require('./routes/settings');
const embedRoutes = require('./routes/embed');

// Add these after existing routes
const pushRoutes = require('./routes/push');
const liveDataRoutes = require('./routes/liveData');
const widgetDataRoutes = require('./routes/widgetData');

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for widget embedding
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialproof';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log(`📁 Database: ${mongoose.connection.name}`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('💡 Make sure MongoDB is running or add Atlas URI in .env');
    });

// API Routes
app.use('/api/widgets', widgetRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/embed', embedRoutes);

app.use('/api/push', pushRoutes);
app.use('/api/live-data', liveDataRoutes);
app.use('/api/widget-data', widgetDataRoutes);

// Serve widget script
app.get('/widget.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.sendFile(path.join(__dirname, 'public', 'widget.js'));
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        mongodb: mongoose.connection.readyState === 1
            ? 'connected'
            : 'disconnected'
    });
});

// Catch all frontend routes (Express 5 safe)
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📋 Widget script: http://localhost:${PORT}/widget.js`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});