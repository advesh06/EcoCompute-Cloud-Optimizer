const mongoose = require('mongoose');

const CloudResourceSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  instanceType: { type: String, default: 'unknown' },
  tdp: { type: Number, required: true }, // Power draw in Watts
  cpuUtilization: { type: Number, required: true }, // CPU % utilization
  pue: { type: Number, default: 1.2 }, // Locked to 1.2 per specification
  region: { type: String, required: true }, // mumbai, delhi, bangalore, chennai, stockholm
  hourlyRate: { type: Number, required: true }, // Hourly cost rate in ₹
  environment: { type: String, default: 'production' }, // production, dev, test
  
  // Computed Post-Detection Fields
  energyKWh: { type: Number },
  carbonKg: { type: Number },
  costINR: { type: Number },
  classification: { type: String }, // Idle, Underutilized, Optimal, Overloaded
  
  // Post-Optimization Audit Log Reference
  isOptimized: { type: Boolean, default: false },
  optimizedEnergyKWh: { type: Number },
  optimizedCarbonKg: { type: Number },
  optimizedCostINR: { type: Number },
  recommendationApplied: { type: String },
  
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CloudResource', CloudResourceSchema);