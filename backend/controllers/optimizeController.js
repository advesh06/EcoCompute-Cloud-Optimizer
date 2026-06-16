const CloudResource = require('../models/CloudResource');
const { generateOptimizationRules } = require('../utils/carbonMath');

// 1. Fetch current infrastructure profiles and append automated recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const resources = await CloudResource.find();
    
    const recommendations = resources.map(node => {
      const { recommendation, savingsPercent } = generateOptimizationRules(node);
      
      return {
        _id: node._id,
        serverName: node.serverName,
        region: node.region,
        cpuUtilization: node.cpuUtilization,
        classification: node.classification,
        environment: node.environment,
        currentEnergyKWh: node.energyKWh,
        currentCarbonKg: node.carbonKg,
        currentCostINR: node.costINR,
        recommendation,
        savingsPercent: savingsPercent * 100 // Convert fraction to percentage display
      };
    });

    res.json(recommendations);
  } catch (error) {
    console.error("Error generating system recommendations:", error);
    res.status(500).json({ error: "Failed to compile infrastructure recommendations." });
  }
};

// 2. Apply recommendations and calculate delta optimizations (Before vs After)
exports.applyOptimization = async (req, res) => {
  try {
    const resources = await CloudResource.find();
    
    let totalMonthlySavingsINR = 0;
    let totalEnergyReductionKWh = 0;
    let totalCarbonReductionKg = 0;

    for (let node of resources) {
      const { recommendation, savingsPercent } = generateOptimizationRules(node);
      
      if (savingsPercent > 0 || recommendation.includes("Migrate")) {
        // Evaluate mathematical reduction impacts
        let optimizedEnergy = node.energyKWh;
        let optimizedCarbon = node.carbonKg;
        let optimizedCost = node.costINR;

        if (recommendation === "Shutdown Server") {
          optimizedEnergy = 0;
          optimizedCarbon = 0;
          optimizedCost = 0;
        } else if (recommendation === "Rightsize Instance") {
          optimizedEnergy = node.energyKWh * 0.60; // 40% Savings means 60% remains
          optimizedCost = node.costINR * 0.60;
          optimizedCarbon = node.carbonKg * 0.60;
        } else if (recommendation === "Auto Shutdown Schedule (Off-Hours)") {
          optimizedEnergy = node.energyKWh * 0.50; // 50% Savings
          optimizedCost = node.costINR * 0.50;
          optimizedCarbon = node.carbonKg * 0.50;
        } else if (recommendation.includes("Migrate To Greener Region")) {
          // Stockholm has an intensity of 8 vs high Indian grids. 
          // Retains original processing energy & cost, drops carbon factor down to ~1.2%
          optimizedCarbon = (node.energyKWh * 1.2 * 8) / 1000;
        }

        // Calculate absolute asset drops
        totalMonthlySavingsINR += (node.costINR - optimizedCost);
        totalEnergyReductionKWh += (node.energyKWh - optimizedEnergy);
        totalCarbonReductionKg += (node.carbonKg - optimizedCarbon);

        // Update entry state inside MongoDB database schema
        node.isOptimized = true;
        node.optimizedEnergyKWh = parseFloat(optimizedEnergy.toFixed(3));
        node.optimizedCarbonKg = parseFloat(optimizedCarbon.toFixed(3));
        node.optimizedCostINR = parseFloat(optimizedCost.toFixed(2));
        node.recommendationApplied = recommendation;
        await node.save();
      }
    }

    res.json({
      success: true,
      message: "Infrastructure resource optimization rules applied successfully!",
      metrics: {
        monthlySavingsINR: parseFloat(totalMonthlySavingsINR.toFixed(2)),
        annualSavingsINR: parseFloat((totalMonthlySavingsINR * 12).toFixed(2)), // Monthly * 12
        co2ReductionKg: parseFloat(totalCarbonReductionKg.toFixed(2)),
        energyReductionKWh: parseFloat(totalEnergyReductionKWh.toFixed(2))
      }
    });
  } catch (error) {
    console.error("Error executing infrastructure action plans:", error);
    res.status(500).json({ error: "Optimization batch transaction execution fault." });
  }
};