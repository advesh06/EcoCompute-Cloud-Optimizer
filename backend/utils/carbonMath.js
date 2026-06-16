// Data-grid carbon intensity metrics per your regional cloud specifications
const REGIONAL_EMISSION_FACTORS = {
  mumbai: 708,
  delhi: 680,
  bangalore: 620,
  chennai: 600,
  stockholm: 8
};

// PUE constant hardcoded per infrastructure tracking specifications
const SYSTEM_PUE = 1.2;

// Standard cloud infrastructure scheduling interval constant (Average operational hours per month)
const MONTHLY_OPERATIONAL_HOURS = 730;

function calculateEnergy(tdp, cpuUtilization) {
  return (tdp * MONTHLY_OPERATIONAL_HOURS * (cpuUtilization / 100)) / 1000;
}

function calculateCarbon(energyKWh, region) {
  const normRegion = String(region).toLowerCase().trim();
  const intensity = REGIONAL_EMISSION_FACTORS[normRegion] || 708; // Defaults to Mumbai grid baseline
  return (energyKWh * SYSTEM_PUE * intensity) / 1000;
}

function calculateCost(hourlyRate) {
  return parseFloat(hourlyRate) * MONTHLY_OPERATIONAL_HOURS;
}

function getClassification(cpuUtilization) {
  const usage = parseFloat(cpuUtilization);
  if (usage < 10) return 'Idle';
  if (usage >= 10 && usage < 40) return 'Underutilized';
  if (usage >= 40 && usage <= 70) return 'Optimal';
  return 'Overloaded';
}

// Single Source of Truth for Optimization Rules across all views
function generateOptimizationRules(node) {
  const classification = getClassification(node.cpuUtilization);
  let recommendation = "Maintain Status Quo";
  let savingsPercent = 0;

  if (classification === 'Idle') {
    recommendation = "Shutdown Server";
    savingsPercent = 1.0; 
  } else if (classification === 'Underutilized') {
    recommendation = "Rightsize Instance";
    savingsPercent = 0.4; 
  } else if (node.environment === 'dev' || node.environment === 'test') {
    recommendation = "Auto Shutdown Schedule (Off-Hours)";
    savingsPercent = 0.5; 
  } else if (node.region.toLowerCase() !== 'stockholm' && node.cpuUtilization > 50) {
    recommendation = "Migrate to Greener Region (Stockholm)";
    savingsPercent = 0.0; 
  }

  return { recommendation, savingsPercent };
}

module.exports = {
  calculateEnergy,
  calculateCarbon,
  calculateCost,
  getClassification,
  generateOptimizationRules
};