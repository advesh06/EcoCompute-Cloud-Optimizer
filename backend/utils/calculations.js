const CARBON_INTENSITY = {
  'us-east-1': 350,
  'eu-north-1': 10,
  'ap-south-1': 700
};

const calculateEnergy = (tdp, utilization, pue, hours) => {
  const utilFactor = utilization > 1 ? utilization / 100 : utilization;
  const energy = (tdp * utilFactor * pue * hours) / 1000;
  return parseFloat(energy.toFixed(3));
};

const calculateCarbon = (energyKWh, region) => {
  const intensity = CARBON_INTENSITY[region] || 400;
  const carbon = (energyKWh * intensity) / 1000;
  return parseFloat(carbon.toFixed(3));
};

const calculateCost = (hourlyRate, hours) => {
  const cost = hourlyRate * hours;
  return parseFloat(cost.toFixed(2));
};

module.exports = { calculateEnergy, calculateCarbon, calculateCost, CARBON_INTENSITY };