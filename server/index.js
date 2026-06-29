// File path: /server/index.js
// Purpose: Backend entry point. Initializes DB and Config before starting server.

const app = require('./app');
const configService = require('./lib/configService');
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log(' Starting EthioDomestic Backend...');
    
    // 1. Initialize Config Service (loads defaults + DB overrides)
    await configService.init();
    
    // 2. Start Express Server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 Config API: http://localhost:${PORT}/api/config`);
      console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();