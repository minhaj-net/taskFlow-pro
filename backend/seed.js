/**
 * seed.js — Register all demo users into MongoDB
 * Run: node seed.js
 */

require('dotenv').config()
const { setServers } = require('node:dns/promises')
setServers(['1.1.1.1', '8.8.8.8'])

const mongoose = require('mongoose')
const User = require('./src/models/User')
const connectDB = require('./src/config/db')

const demoUsers = [
  { name: 'Alex Morgan',   email: 'admin@demo.com',   password: 'Admin123',   role: 'admin'   },
  { name: 'Jordan Lee',    email: 'manager@demo.com', password: 'Manager123', role: 'manager' },
  { name: 'Sam Rivera',    email: 'member@demo.com',  password: 'Member123',  role: 'member'  },
  { name: 'Taylor Kim',    email: 'taylor@demo.com',  password: 'Taylor123',  role: 'member'  },
  { name: 'Casey Nguyen',  email: 'casey@demo.com',   password: 'Casey123',   role: 'member'  },
]

async function seed() {
  await connectDB()
  console.log('\n🌱 Seeding demo users...\n')

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email })
    if (exists) {
      console.log(`⏭  Skipped (already exists): ${u.email}`)
      continue
    }
    await User.create(u)
    console.log(`✅ Created: ${u.email} [${u.role}]`)
  }

  console.log('\n✔  Seeding complete!\n')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
