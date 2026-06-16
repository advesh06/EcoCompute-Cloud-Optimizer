const { 
  calculateEnergy, 
  calculateCarbon, 
  calculateCost, 
  getClassification 
} = require('../utils/carbonMath');

exports.calculateLiveMetrics = (req, res) => {
  try {
    const { tdp, utilization, region, hourlyRate } = req.body;

    // Convert string inputs to floating numeric points safely
    const numTdp = parseFloat(tdp) || 0;
    const numCpu = parseFloat(utilization) || 0;
    const numRate = parseFloat(hourlyRate) || 0;
    const targetRegion = region || 'mumbai';

    // Apply strict structural formulas
    const energyKWh = calculateEnergy(numTdp, numCpu);
    const carbonKg = calculateCarbon(energyKWh, targetRegion);
    const costINR = calculateCost(numRate);
    const classification = getClassification(numCpu);

    res.json({
      energyKWh: parseFloat(energyKWh.toFixed(3)),
      carbonKg: parseFloat(carbonKg.toFixed(3)),
      costINR: parseFloat(costINR.toFixed(2)),
      classification
    });
  } catch (error) {
    console.error("Error running validation pipeline rules:", error);
    res.status(500).json({ error: "Telemetry calculation runtime failure." });
  }
};