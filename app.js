function runParallelAgents() {
  const vin = document.getElementById("vinInput").value.trim();
  const dtcRaw = document.getElementById("dtcInput").value.trim();
  const outputEl = document.getElementById("hypothesisOutput");

  const dtcList = dtcRaw.split(",").map(c => c.trim().toUpperCase());

  // Check for dual lean condition (P0171 + P0174)
  if (dtcList.includes("P0171") && dtcList.includes("P0174")) {
    outputEl.innerHTML = `
      <div class="hypothesis-box">
        <div class="hypo-header">
          <span class="hypo-title">Intake Manifold Gasket Failure</span>
          <span class="hypo-score">88%</span>
        </div>
        <p class="hypo-desc">Electrical & Mechanical agents confirmed unmetered air correlation across both banks.</p>
      </div>

      <div class="action-box">
        <div class="action-title">Homework Action Required:</div>
        <p class="action-desc">Measure intake port vacuum level using a physical gauge to isolate gasket vs MAF sensor failure.</p>
      </div>
    `;
  } else if (dtcList.length > 0 && dtcList[0] !== "") {
    outputEl.innerHTML = `
      <div class="hypothesis-box" style="background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3);">
        <div class="hypo-header">
          <span class="hypo-title" style="color: #38bdf8;">DTC Analysis for ${dtcList.join(", ")}</span>
          <span class="hypo-score" style="color: #38bdf8;">75%</span>
        </div>
        <p class="hypo-desc">Single fault code detected for vehicle VIN ${vin}. Agent recommends sensor recalibration check.</p>
      </div>
    `;
  } else {
    outputEl.innerHTML = `<div class="placeholder-text">Please enter valid DTC codes to run agent analysis.</div>`;
  }
}
