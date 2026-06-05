/**
 * server.js - Entry point
 * Loads env, connects to MongoDB, and starts the Express server.
 */

// Force DNS resolution through Cloudflare + Google — fixes SRV lookup issues
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}\n`);
  });
});
