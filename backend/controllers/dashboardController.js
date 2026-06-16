const CloudResource = require('../models/CloudResource');
const { 
  calculateEnergy, 
  calculateCarbon, 
  calculateCost, 
  getClassification 
} = require('../utils/carbonMath');

exports.getDashboardSummary = async (req, res) => {
  try {
    const resources = await CloudResource.find();
    
    let totalEnergy = 0;
    let totalCarbon = 0;
    let totalCost = 0;
    let idleCount = 0;

    resources.forEach(node => {
      totalEnergy += node.energyKWh || 0;
      totalCarbon += node.carbonKg || 0;
      totalCost += node.costINR || 0;
      if (getClassification(node.cpuUtilization) === 'Idle') idleCount++;
    });

    res.json({
      serversScanned: resources.length,
      idleDetected: idleCount,
      totalEnergyKWh: parseFloat(totalEnergy.toFixed(2)),
      totalCarbonKg: parseFloat(totalCarbon.toFixed(2)),
      totalCostINR: parseFloat(totalCost.toFixed(2))
    });
  } catch (error) {
    console.error("Dashboard metrics aggregation crash:", error);
    res.status(500).json({ error: "Internal server monitoring error." });
  }
};

exports.seedDemoDataset = async (req, res) => {
  try {
    const demoNodes = [
      { serverName: "DL-Core-WebCluster-01", instanceType: "t3.medium", tdp: 65, cpuUtilization: 8, region: "delhi", hourlyRate: 3.5, environment: "production" },
      { serverName: "BLR-Analytics-Node", instanceType: "r5.xlarge", tdp: 240, cpuUtilization: 25, region: "bangalore", hourlyRate: 21.0, environment: "production" },
      { serverName: "MUM-Legacy-TestingVM", instanceType: "m5.large", tdp: 190, cpuUtilization: 5, region: "mumbai", hourlyRate: 16.0, environment: "test" },
      { serverName: "CH-DevSandbox-Env", instanceType: "c5.2xlarge", tdp: 350, cpuUtilization: 78, region: "chennai", hourlyRate: 28.5, environment: "dev" },
      { serverName: "STO-CleanCompute-01", instanceType: "t3.large", tdp: 85, cpuUtilization: 52, region: "stockholm", hourlyRate: 5.2, environment: "production" }
    ];

    const structuredDemo = demoNodes.map(node => {
      const energy = calculateEnergy(node.tdp, node.cpuUtilization);
      const carbon = calculateCarbon(energy, node.region);
      const cost = calculateCost(node.hourlyRate);
      const classification = getClassification(node.cpuUtilization);

      return {
        ...node,
        pue: 1.2,
        energyKWh: parseFloat(energy.toFixed(3)),
        carbonKg: parseFloat(carbon.toFixed(3)),
        costINR: parseFloat(cost.toFixed(2)),
        classification,
        isOptimized: false
      };
    });

    await CloudResource.deleteMany({});
    const inserted = await CloudResource.insertMany(structuredDemo);

    res.json({ 
      success: true, 
      message: `Demo asset infrastructure dataset seeded successfully! Loaded ${inserted.length} nodes.`, 
      count: inserted.length 
    });
  } catch (err) {
    console.error("Seeding operation failed:", err);
    res.status(500).json({ success: false, message: "Demo seed procedure failed internally." });
  }
};