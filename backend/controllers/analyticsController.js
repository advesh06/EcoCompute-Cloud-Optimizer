const CloudResource = require('../models/CloudResource');
const { generateOptimizationRules } = require('../utils/carbonMath');

exports.getAnalyticsTrends = async (req, res) => {
  try {
    const resources = await CloudResource.find();

    if (!resources || resources.length === 0) {
      return res.json({
        success: true,
        top5Highest: [], top5Lowest: [], costTrend: [], carbonTrend: [], regionData: [],
        aiInsights: ["No active cluster deployments mapped. Please run infrastructure seed module on Dashboard."],
        summary: { monthlySavings: "0.00", annualSavings: "0.00", carbonSaved: "0.00" }
      });
    }

    const sortedByEnergyDesc = [...resources].sort((a, b) => (b.energyKWh || 0) - (a.energyKWh || 0));
    const top5Consumers = sortedByEnergyDesc.slice(0, 5).map(r => ({ name: r.serverName, value: r.energyKWh }));
    const lowest5Consumers = [...sortedByEnergyDesc].reverse().slice(0, 5).map(r => ({ name: r.serverName, value: r.energyKWh }));

    let totalCurrentCost = 0, totalOptimizedCost = 0;
    let totalCurrentCarbon = 0, totalOptimizedCarbon = 0;
    let shutdownCount = 0;
    const regionMetrics = {};

    resources.forEach(node => {
      totalCurrentCost += node.costINR || 0;
      totalCurrentCarbon += node.carbonKg || 0;

      const { recommendation, savingsPercent } = generateOptimizationRules(node);
      
      let optCost = node.costINR;
      let optCarbon = node.carbonKg;

      if (recommendation === "Shutdown Server") {
        optCost = 0;
        optCarbon = 0;
        shutdownCount++;
      } else if (recommendation === "Rightsize Instance" || recommendation === "Auto Shutdown Schedule (Off-Hours)") {
        optCost = node.costINR * (1 - savingsPercent);
        optCarbon = node.carbonKg * (1 - savingsPercent);
      } else if (recommendation.includes("Migrate")) {
        optCarbon = (node.energyKWh * 1.2 * 8) / 1000;
      }

      totalOptimizedCost += optCost;
      totalOptimizedCarbon += optCarbon;

      const reg = node.region.toUpperCase();
      if (!regionMetrics[reg]) {
        regionMetrics[reg] = { region: reg, currentCost: 0, currentCarbon: 0, count: 0 };
      }
      regionMetrics[reg].currentCost += node.costINR;
      regionMetrics[reg].currentCarbon += node.carbonKg;
      regionMetrics[reg].count += 1;
    });

    const monthlyFinancialSavings = totalCurrentCost - totalOptimizedCost;
    const annualFinancialSavings = monthlyFinancialSavings * 12;
    const carbonReductionWeight = totalCurrentCarbon - totalOptimizedCarbon;

    const aiInsights = [
      `Potential Monthly Overhead Savings: Evaluation identifies an immediate operational cash reduction of ₹${monthlyFinancialSavings.toFixed(2)} available.`,
      `Projected Annual ROI Acceleration: Scaling optimizations across these assets will yield an estimated annualized profitability increase of ₹${annualFinancialSavings.toFixed(2)}.`,
      `Critical Resource Remediation: ${shutdownCount} server instance(s) are operating below acceptable CPU index parameters and are recommended for shutdown.`,
      `Carbon Abatement Opportunity: Geographically shifting intense data workloads can neutralize up to ${carbonReductionWeight.toFixed(2)} kg of active grid CO₂ footprints.`
    ];

    res.json({
      success: true,
      top5Highest: top5Consumers,
      top5Lowest: lowest5Consumers,
      costTrend: [
        { timeline: 'Current Base', Cost: parseFloat(totalCurrentCost.toFixed(2)) },
        { timeline: 'Optimized Target', Cost: parseFloat(totalOptimizedCost.toFixed(2)) }
      ],
      carbonTrend: [
        { timeline: 'Current Base', Carbon: parseFloat(totalCurrentCarbon.toFixed(2)) },
        { timeline: 'Optimized Target', Carbon: parseFloat(totalOptimizedCarbon.toFixed(2)) }
      ],
      regionData: Object.values(regionMetrics),
      aiInsights,
      summary: {
        monthlySavings: monthlyFinancialSavings.toFixed(2),
        annualSavings: annualFinancialSavings.toFixed(2),
        carbonSaved: carbonReductionWeight.toFixed(2)
      }
    });

  } catch (err) {
    console.error("Analytics calculations delivery failure:", err);
    res.status(500).json({ success: false, error: "Failed to parse data models across tracking intervals." });
  }
};