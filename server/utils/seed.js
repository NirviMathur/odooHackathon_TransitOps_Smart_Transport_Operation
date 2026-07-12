require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

async function seed() {
  await connectDB();
  console.log('Seeding database...');

  await Promise.all([User.deleteMany({}), Vehicle.deleteMany({}), Driver.deleteMany({})]);

  await User.create([
    { name: 'Fatima Fleet', email: 'fleet@transitops.com', password: 'password123', role: 'FleetManager' },
    { name: 'Alex Driver', email: 'driver@transitops.com', password: 'password123', role: 'Driver' },
    { name: 'Sam Safety', email: 'safety@transitops.com', password: 'password123', role: 'SafetyOfficer' },
    { name: 'Fiona Finance', email: 'finance@transitops.com', password: 'password123', role: 'FinancialAnalyst' },
  ]);

  await Vehicle.create([
    { registrationNumber: 'VAN-05', name: 'Ford Transit', type: 'Van', maxLoadCapacity: 500, odometer: 12000, acquisitionCost: 35000, region: 'North', status: 'Available' },
    { registrationNumber: 'TRK-11', name: 'Volvo FH', type: 'Truck', maxLoadCapacity: 5000, odometer: 82000, acquisitionCost: 120000, region: 'South', status: 'Available' },
  ]);

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  await Driver.create([
    { name: 'Alex Johnson', licenseNumber: 'LIC-1001', licenseCategory: 'B', licenseExpiryDate: oneYearFromNow, contactNumber: '555-0101', safetyScore: 95, status: 'Available' },
    { name: 'Priya Singh', licenseNumber: 'LIC-1002', licenseCategory: 'C', licenseExpiryDate: oneYearFromNow, contactNumber: '555-0102', safetyScore: 88, status: 'Available' },
  ]);

  console.log('Seed complete. Demo logins (password: password123):');
  console.log('  fleet@transitops.com   (FleetManager)');
  console.log('  driver@transitops.com  (Driver)');
  console.log('  safety@transitops.com  (SafetyOfficer)');
  console.log('  finance@transitops.com (FinancialAnalyst)');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
