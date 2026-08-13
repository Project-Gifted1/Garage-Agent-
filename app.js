// Telematics Data Provider
function getSimulatedVehicleData() {
  return {
    timestamp: new Date().toISOString(),
    vehicle: {
      make: "Mercedes-Benz",
      model: "C-Class",
      vin: "WDD2050001A000000"
    },
    telemetry: {
      odometerKm: 45210,
      batteryVoltage: 12.4,
      doorState: "LOCKED"
    },
    diagnosticCodes: [
      { code: "P0171", system: "Powertrain", description: "System Too Lean (Bank 1)" },
      { code: "P0174", system: "Powertrain", description: "System Too Lean (Bank 2)" }
    ]
  };
}

// Agent 1: DTC Analysis & Correlation
function agentAnalyzeCodes(codes) {
  const codeList = codes.map(c => c.code);
  let analysis = { primaryIssue: "Unknown", confidence: 0, likelyCauses: [] };

  if (codeList.includes("P0171") && codeList.includes("P0174")) {
    analysis.primaryIssue = "Systemic Lean Condition across both engine banks.";
    analysis.likelyCauses = [
      "Mass Air Flow (MAF) sensor fault or contamination",
      "Unmetered air entry (Vacuum line leak or intake manifold gasket leak)",
      "Low fuel pressure / failing fuel delivery system"
    ];
    analysis.confidence = 0.92;
  }
  return analysis;
}

// Agent 2: Action & Repair Strategy Generation
function agentGenerateRepairPlan(analysis) {
  if (analysis.confidence > 0.8) {
    return [
      "1. Inspect Mass Air Flow (MAF) sensor element for contamination; clean or replace.",
      "2. Perform smoke test on intake system to verify zero unmetered air leaks.",
      "3. Verify fuel pressure at rail against OEM spec (approx. 3.8-4.2 bar)."
    ];
  }
  return ["Perform manual visual inspection of engine bay."];
}

// Orchestrator Execution Loop
function runDiagnostics() {
  const outputEl = document.getElementById("output");
  const data = getSimulatedVehicleData();
  
  // Execute Agent Pipeline
  const analysis = agentAnalyzeCodes(data.diagnosticCodes);
  const repairPlan = agentGenerateRepairPlan(analysis);

  let report = `=== GARAGE AGENT™ DIAGNOSTIC REPORT ===\n`;
  report += `Vehicle: ${data.vehicle.make} ${data.vehicle.model} (${data.vehicle.vin})\n`;
  report += `Active DTCs: ${data.diagnosticCodes.map(c => c.code).join(", ")}\n\n`;
  report += `[AGENT 1 - ROOT CAUSE DIAGNOSIS]\n`;
  report += `Issue: ${analysis.primaryIssue}\n`;
  report += `Confidence Score: ${(analysis.confidence * 100)}%\n`;
  report += `Likely Causes:\n${analysis.likelyCauses.map(c => ` - ${c}`).join("\n")}\n\n`;
  report += `[AGENT 2 - RECOMMENDED ACTION PLAN]\n`;
  report += `${repairPlan.join("\n")}\n`;

  outputEl.textContent = report;
}

function unlockVehicle() {
  const outputEl = document.getElementById("output");
  outputEl.textContent = "Sending remote command over cellular network...\n\n[SUCCESS 200]: Door unlock signal dispatched to vehicle.";
}
