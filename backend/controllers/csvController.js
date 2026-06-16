const fs = require('fs');
const csv = require('csv-parser');
const CloudResource = require('../models/CloudResource');
const { 
  calculateEnergy, 
  calculateCarbon, 
  calculateCost, 
  getClassification 
} = require('../utils/carbonMath');

exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No dataset file uploaded." });
  }

  const resultsArray = [];
  const filePath = req.file.path;

  // Stream read and validate columns inside incoming dataset rows
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Validate structure requirements match specification inputs
      if (data.serverName && data.tdp && data.cpuUtilization && data.region && data.hourlyRate) {
        const tdp = parseFloat(data.tdp);
        const cpu = parseFloat(data.cpuUtilization);
        const rate = parseFloat(data.hourlyRate);
        const region = data.region.toLowerCase().trim();
        const env = (data.environment || 'production').toLowerCase().trim();

        // Evaluate core ecological math utilities
        const energy = calculateEnergy(tdp, cpu);
        const carbon = calculateCarbon(energy, region);
        const cost = calculateCost(rate);
        const classification = getClassification(cpu);

        resultsArray.push({
          serverName: data.serverName,
          instanceType: data.instanceType || 'standard',
          tdp,
          cpuUtilization: cpu,
          pue: 1.2,
          region,
          hourlyRate: rate,
          environment: env,
          energyKWh: parseFloat(energy.toFixed(3)),
          carbonKg: parseFloat(carbon.toFixed(3)),
          costINR: parseFloat(cost.toFixed(2)),
          classification,
          isOptimized: false
        });
      }
    })
    .on('end', async () => {
      try {
        if (resultsArray.length === 0) {
          fs.unlinkSync(filePath); // Clean up temp file
          return res.status(400).json({ success: false, message: "Validation error: Missing required system column arrays." });
        }

        // Wipe old temporary dataset entries to ensure fresh sync across panels
        await CloudResource.deleteMany({});
        
        // Batch insert newly parsed infrastructure entities
        const storedResources = await CloudResource.insertMany(resultsArray);
        
        // Clean up file from temp directory storage
        fs.unlinkSync(filePath);

        res.json({
          success: true,
          message: `Dataset successfully processed. Ingested ${storedResources.length} cloud node profiles.`,
          count: storedResources.length
        });
      } catch (err) {
        console.error("Database ingestion runtime error:", err);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ success: false, message: "Database write storage fault." });
      }
    });
};