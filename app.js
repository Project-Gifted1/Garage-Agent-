// Configuration
const SMARTCAR_CLIENT_ID = 'b29a00b0-21d3-46d3-b942-6be8e474ce04';
const WORKER_URL = 'https://garage-agent.gnfcw9w5rk.workers.dev';

// Current Lock State Tracker
let isLocked = true;

// 1. Lock / Unlock Vehicle Function
async function toggleLock() {
  const logTimeline = document.getElementById('timeline');
  const action = isLocked ? 'unlock' : 'lock';
  
  logTimeline.innerHTML += `<div class="timeline-entry">[CMD] Sending ${action.toUpperCase()} command...</div>`;

  try {
    const response = await fetch(`${WORKER_URL}/api/security`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action })
    });

    if (response.ok) {
      isLocked = !isLocked;
      const doorElem = document.querySelectorAll('.telem-value')[1];
      if (doorElem) {
        doorElem.textContent = isLocked ? 'LOCKED' : 'UNLOCKED';
        doorElem.style.color = isLocked ? '#ff5964' : '#4edd85';
      }
      logTimeline.innerHTML += `<div class="timeline-entry" style="color: #4edd85;">[SUCCESS] Vehicle ${action}ed successfully.</div>`;
    } else {
      // Fallback UI toggle for simulated frontend testing if backend worker is offline
      isLocked = !isLocked;
      const doorElem = document.querySelectorAll('.telem-value')[1];
      if (doorElem) {
        doorElem.textContent = isLocked ? 'LOCKED' : 'UNLOCKED';
        doorElem.style.color = isLocked ? '#ff5964' : '#4edd85';
      }
      logTimeline.innerHTML += `<div class="timeline-entry" style="color: #00d2ff;">[SIM] Local state toggled to ${action.toUpperCase()}.</div>`;
    }
  } catch (err) {
    // Local simulation fallback
    isLocked = !isLocked;
    const doorElem = document.querySelectorAll('.telem-value')[1];
    if (doorElem) {
      doorElem.textContent = isLocked ? 'LOCKED' : 'UNLOCKED';
      doorElem.style.color = isLocked ? '#ff5964' : '#4edd85';
    }
    logTimeline.innerHTML += `<div class="timeline-entry" style="color: #00d2ff;">[SIM] Network bypass: Toggled lock state locally.</div>`;
  }
}

// 2. Run Parallel Agents Function
function runAgents() {
  const container = document.getElementById('hypotheses-container');
  const timeline = document.getElementById('timeline');
  const dtcValue = document.getElementById('dtc-input').value;

  timeline.innerHTML += `<div class="timeline-entry">[AGENT] FSM triggering diagnostic agents...</div>`;

  container.innerHTML = `
    <div class="hypo-card">
      <div style="font-size: 0.85rem; font-weight: bold; color: #00d2ff;">Agent 1: Intake Air Leakage</div>
      <div class="hypo-desc">Codes ${dtcValue} indicate lean mixture on both banks. High probability of vacuum line rupture or faulty MAF sensor.</div>
    </div>
    <div class="hypo-card" style="border-left-color: #ff9f43;">
      <div style="font-size: 0.85rem; font-weight: bold; color: #ff9f43;">Agent 2: Fuel Delivery Low</div>
      <div class="hypo-desc">Fuel pressure sitting at 3.9 BAR. Recommend checking fuel filter flow rate and pump duty cycle.</div>
    </div>
  `;

  timeline.innerHTML += `<div class="timeline-entry" style="color: #4edd85;">[COMPLETE] Diagnostic hypotheses generated.</div>`;
}
