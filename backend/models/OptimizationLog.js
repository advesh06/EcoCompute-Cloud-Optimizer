const mongoose = require('mongoose');

const OptimizationLogSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'CloudResource', required: true },
  recommendation: { type: String, required: true },
  type: { type: String, enum: ['cost', 'carbon', 'energy'], required: true },
  saving: { type: Number, required: true },
  carbonReduction: { type: Number, required: true },
  applied: { type: Boolean, default: false },
  appliedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('OptimizationLog', OptimizationLogSchema);