const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const publicRoutes = require('./routes/public');

// Middleware
app.use('/api/public', publicRoutes);
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Kanban Barcoded System API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Welcome route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Kanban Barcoded System API',
    endpoints: {
      health: '/api/health',
      docs: 'Coming soon...'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kanban Barcoded System Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;