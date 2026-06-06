/**
 * server.js - Entry point
 * Works both locally (Express listen) and on Vercel (serverless export).
 */

// Force DNS resolution through Cloudflare + Google — fixes SRV lookup issues
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const app      = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to MongoDB once (cached for serverless warm runs)
let isConnected = false;

async function ensureConnected() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// ── Local development — start Express server ──────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  ensureConnected().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 http://localhost:${PORT}\n`);
    });
  });
}

// ── Vercel serverless — connect on each cold start then handle ─
const handler = async (req, res) => {
  await ensureConnected();
  return app(req, res);
};

module.exports = handler;
