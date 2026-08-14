// Function to update the audit timeline
function addTimelineLog(message) {
  const timeline = document.getElementById('timeline');
  if (timeline) {
    const now = new Date().toLocaleTimeString();
    const logEntry = document.createElement('p');
    logEntry.textContent = `[${now}] ${message}`;
    timeline.prepend(logEntry);
  }
}

// 1. Connect Real Vehicle (Smartcar OAuth Redirect)
function connectVehicle() {
  addTimelineLog("Initiating Smartcar OAuth pairing flow...");
  addTimelineLog("Redirecting to OEM login portal...");
  
  // Real browser redirect to Cloudflare Worker OAuth endpoint
  setTimeout(() => {
    window.location.href = 'https://garage-agent.gnfcw9w5rk.workers.dev/auth';
  }, 1000);
}

// 2. Lock / Unlock Vehicle Simulation
function toggleLock() {
  addTimelineLog("Sending remote security command to vehicle...");
  setTimeout(() => {
    addTimelineLog("Vehicle security state toggled successfully.");
  }, 1000);
}

// 3. Run Parallel Agents Diagnostic Flow
function runAgents() {
  addTimelineLog("Launching parallel diagnostic agents...");
  
  const container = document.getElementById('hypotheses-container');
  if (container) {
    container.innerHTML = `
      <div class="hypo-card">
        <h4>1. Intake Manifold Leak (High Confidence)</h4>
        <p class="hypo-desc">System lean on both banks (P0171/P0174) indicates unmetered air entering downstream of MAF sensor.</p>
      </div>
      <div class="hypo-card">
        <h4>2. Mass Air Flow (MAF) Sensor Contamination</h4>
        <p class="hypo-desc">Under-reporting airflow reading causing ECU to lean out fuel trims across both cylinder banks.</p>
      </div>
    `;
  }
  
  setTimeout(() => {
    addTimelineLog("Diagnostic hypotheses generated across 2 active agents.");
  }, 1500);
}
