// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { setupLogger } = require('./src/middleware/logger');
const { startMemoryMonitoring, getMemoryStatus } = require('./src/middleware/memory-monitor');

// Import routes
const speciesRoutes = require('./src/routes/species');
const certificateRoutes = require('./src/routes/certificate');
const userRoutes = require('./src/routes/user');
const calendarRoutes = require('./src/routes/calendar');
const rankingRoutes = require('./src/routes/ranking');
const posterRoutes = require('./src/routes/poster');
const achievementRoutes = require('./src/routes/achievement');

// Import database
const { sequelize } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Nginx reverse proxy (fixes X-Forwarded-For error)
app.set('trust proxy', true);

// Security: Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Fix X-Forwarded-For parsing error
  validate: { xForwardedForHeader: true },
  // Skip health checks from rate limiting
  skip: (req) => req.url === '/health'
});

// Stricter limit for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: {
    success: false,
    error: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Fix X-Forwarded-For parsing error
  validate: { xForwardedForHeader: true }
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
setupLogger(app); // File-based logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);
app.use('/api/users/login', loginLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  const memoryInfo = getMemoryStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      status: memoryInfo.status,
      heapUsed: memoryInfo.heapUsed,
      heapUsedPercent: memoryInfo.heapUsedPercent,
      trend: memoryInfo.trend.trend
    }
  });
});

// Memory status endpoint (for monitoring)
app.get('/status/memory', (req, res) => {
  res.json(getMemoryStatus());
});

// API Routes
app.use('/api/species', speciesRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/achievements', achievementRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Database connection and server start
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (in production, use migrations)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized.');
    }

    // Start memory monitoring
    startMemoryMonitoring();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Memory monitoring enabled`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
