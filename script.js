
let isAdmin = false;

let currentGCNumber = null;
const firebaseConfig = {
   apiKey: "AIzaSyDH8QRh5zUY-sfr6QSQubD_5pRY0LC9ShY",
  authDomain: "gas-rate88.firebaseapp.com",
  projectId: "gas-rate88",
  storageBucket: "gas-rate88.firebasestorage.app",
  messagingSenderId: "317310053708",
  appId: "1:317310053708:web:1a27ad37f4164651a1b3e9",
  measurementId: "G-F5HVCE6HL9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let currentSessionId = null;

// ✅ Show login or app depending on user status
firebase.auth().onAuthStateChanged((user) => {
  handleUserAuthState(user);
});

function handleUserAuthState(user) {
  const adminButton = document.getElementById('adminBtn');
  const secretArea = document.getElementById('secretTapArea');

  // ✅ Delay to ensure DOM is ready
  setTimeout(() => {
    const adminToggleBtn = document.getElementById('adminToggleBtn');

    if (user) {
      document.getElementById("loginScreen").style.display = "none";
      document.querySelector(".container").style.display = "block";

      if (user.email === "lex@fake.com") {
        if (adminToggleBtn) adminToggleBtn.style.display = "block";
        if (adminButton) adminButton.style.display = "none";

        let tapCount = 0;
        let tapTimeout;

    if (secretArea) {
  let tapCount = 0;
  let tapTimeout;
  let lastTapTime = 0;

  secretArea.addEventListener('click', () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;

    // ✅ Handle double tap to disable admin mode
    if (isAdmin && timeSinceLastTap < 400) {
      isAdmin = false;
      document.body.classList.remove('admin-mode');
      document.getElementById('boilerResult').innerHTML = ''; // 🧼 clear boiler card
      showToast("🔒 Admin Mode disabled");
      return;
    }

    lastTapTime = now;

    // ✅ Handle 5 taps to enable admin mode
    tapCount++;
    clearTimeout(tapTimeout);

    if (tapCount >= 5) {
      tapCount = 0;

      const pass = prompt("Enter admin password:");
      if (pass === "admin123") {
        isAdmin = true;
        document.body.classList.add('admin-mode');
        showToast("✅ Admin Mode enabled");
      } else {
        showToast("❌ Incorrect password");
      }
    }

    tapTimeout = setTimeout(() => {
      tapCount = 0;
    }, 1000);
  });
}



      } else {
        if (adminButton) adminButton.style.display = "none";
        if (adminToggleBtn) adminToggleBtn.style.display = "none";
      }

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
      }

    } else {
      document.getElementById("loginScreen").style.display = "flex";
      document.querySelector(".container").style.display = "none";

      if (adminButton) adminButton.style.display = "none";
      if (adminToggleBtn) adminToggleBtn.style.display = "none";
    }
  }, 100);
}








let countdown;
let stopwatchInterval;
let time = 0;
let isPaused = false;
let imperialMode = false;
let lastNetKW = null;
let lastGrossKW = null;
let lastNetKWMode = null;

function init() {
  const beep = document.getElementById('alertSound');
  const endBeep = document.getElementById('endBeep');

  document.body.addEventListener('click', () => {
    [beep, endBeep].forEach(audio => {
      if (audio) {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {});
      }
    });
  }, { once: true });

  // 🌙 Auto-enable dark mode based on system or saved preference
 applyInitialDarkModeSetting();


  document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
  document.getElementById('imperialToggle').addEventListener('change', toggleImperialMode);
  document.getElementById('gcNumber').addEventListener('input', toggleMode);
  document.getElementById('mode').addEventListener('change', resetTimerOnly);
  document.getElementById('duration').addEventListener('change', resetTimerOnly);
  setupGCInput();
  toggleMode();

  document.getElementById('gcNumber').addEventListener('blur', () => {
    setTimeout(() => {
      const input = document.getElementById('gcNumber');
      const gc = input.value.replace(/\D/g, '');

      if (gc.length === 7) {
        input.value = `${gc.slice(0, 2)}-${gc.slice(2, 5)}-${gc.slice(5, 7)}`;
      }

     const boiler = findBoilerByGC(gc);
if (boiler) {
  showBoilerInfo(boiler);
} else if (gc.trim() !== '') {
  // Only show toast if no match AND no search results are visible
  const resultBox = document.getElementById('boilerResult');
  const visible = resultBox && resultBox.innerHTML.trim() !== '';
  if (!visible) {
    showToast('No boiler found for this G.C. number');
  }
}

    }, 200);
  });
}

function applyInitialDarkModeSetting() {
  const savedPref = localStorage.getItem('darkModePref');
  let isDark;

  if (savedPref === 'on') {
    isDark = true;
  } else if (savedPref === 'off') {
    isDark = false;
  } else {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  document.getElementById('darkModeToggle').checked = isDark;
  document.body.classList.toggle('dark-mode', isDark);
}

function toggleDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  const isDark = toggle.checked;

  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('darkModePref', isDark ? 'on' : 'off');
}



function toggleImperialMode() {
  imperialMode = document.getElementById('imperialToggle').checked;
  document.getElementById('imperialToggleLabel').textContent = imperialMode ? 'Metric Mode' : 'Imperial Mode';

  const status = document.getElementById('imperialStatus');
  const durationLabel = document.querySelector('label[for="duration"]');
  const modeSelect = document.getElementById('mode');
  const modeLabel = document.querySelector('label[for="mode"]');
  const imperialVolumeSection = document.getElementById('imperialVolumeSection');
  const imperialVolumeInput = document.getElementById('imperialVolume');
  const meterReadings = document.getElementById('meterReadings');

  resetTimerOnly();
  document.getElementById('result').textContent = '';
  document.getElementById('result').style.display = 'none';

  document.getElementById('calculateBtn').style.display = imperialMode ? 'none' : 'inline-block';

  const manualOption = [...modeSelect.options].find(opt => opt.value === 'manual');

  if (imperialMode) {
    status.textContent = 'Imperial mode activated';
    modeSelect.value = 'timer';
    if (manualOption) modeSelect.removeChild(manualOption);
    modeSelect.style.display = 'none';
    if (modeLabel) modeLabel.textContent = '';
    imperialVolumeSection.style.display = 'block';
    imperialVolumeInput.value = '0.991';
    imperialVolumeInput.readOnly = true;
    meterReadings.style.display = 'none';
    durationLabel.style.display = 'none';
    document.getElementById('duration').style.display = 'none';
  } else {
    status.textContent = '';
    if (!manualOption) {
      const newOption = document.createElement('option');
      newOption.value = 'manual';
      newOption.textContent = 'Manual Entry';
      modeSelect.insertBefore(newOption, modeSelect.firstChild);
    }
    modeSelect.style.display = '';
    if (modeLabel) modeLabel.textContent = 'Mode:';
    imperialVolumeSection.style.display = 'none';
    imperialVolumeInput.readOnly = false;
    meterReadings.style.display = 'block';
    durationLabel.style.display = '';
    document.getElementById('duration').style.display = '';
  }

  toggleMode();
  toggleDarkMode();
}

function toggleMode() {
  const mode = document.getElementById('mode').value;
  const manualSection = document.getElementById('manualDuration');
  const timerSection = document.getElementById('timerSection');

  manualSection.style.display = mode === 'manual' ? 'block' : 'none';
  timerSection.style.display = mode !== 'manual' ? 'block' : 'none';
}

function startTimer() {
  const startBtn = document.getElementById('startBtn');
  const timeLeft = document.getElementById('timeLeft');

  if (imperialMode) {
    if (!stopwatchInterval) {
      isPaused = false;
      startBtn.textContent = 'Stop Timer';
      stopwatchInterval = setInterval(() => {
        if (!isPaused) {
          time++;
          timeLeft.textContent = formatTime(time);
        }
      }, 1000);
    } else {
      clearInterval(stopwatchInterval);
      stopwatchInterval = null;
      startBtn.textContent = 'Start Timer';
      calculateRate();
    }
    return;
  }

  if (countdown && !isPaused) {
    isPaused = true;
    startBtn.textContent = 'Resume';
    return;
  }

  if (countdown && isPaused) {
    isPaused = false;
    startBtn.textContent = 'Pause';
    return;
  }

  const duration = parseInt(document.getElementById('duration').value);
  let secondsLeft = duration;
  timeLeft.textContent = formatTime(secondsLeft);
  isPaused = false;
  startBtn.textContent = 'Pause';

  countdown = setInterval(() => {
    if (!isPaused) {
      secondsLeft--;
      timeLeft.textContent = formatTime(secondsLeft);

      if (secondsLeft <= 5 && secondsLeft > 0) {
        timeLeft.classList.add('highlight');
        playBeep();

        // ✅ Short buzz per final 5-second beep
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      }

      if (secondsLeft <= 0) {
        clearInterval(countdown);
        countdown = null;
        startBtn.textContent = 'Start Timer';
        timeLeft.classList.remove('highlight');
        timeLeft.textContent = '0:00';

        // ✅ Play end beep and strong vibration
        playEndBeep();
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]); // Double-pulse buzz
        }

        calculateRate();
      }
    }
  }, 1000);
}


function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function playBeep() {
  const beep = document.getElementById('alertSound');
  beep.currentTime = 0;
  beep.play();
}
function playEndBeep() {
  const endBeep = document.getElementById('endBeep');
  if (endBeep) {
    endBeep.currentTime = 0;
    endBeep.play().catch(() => {
      // Mobile may still block it if not unlocked
    });
  }
}

function calculateRate() {
  const result = document.getElementById('result');
  result.textContent = '';
  result.style.display = 'none';
  let volume, duration;

  const gc = document.getElementById('gcNumber').value;
  const boiler = findBoilerByGC(gc);

  if (imperialMode) {
    const volumeUsed = parseFloat(document.getElementById('imperialVolume').value);
    if (isNaN(volumeUsed) || volumeUsed <= 0) {
      result.textContent = 'Please enter a valid volume used in ft³.';
      result.style.display = 'block';
      return;
    }

    if (time === 0) {
      result.textContent = 'Please start and stop the timer.';
      result.style.display = 'block';
      return;
    }

    duration = time;
    const gasRate = (3600 * volumeUsed) / duration;
    const calorificValue = 1040;
    const grossBTU = gasRate * calorificValue;
    const grosskW = grossBTU / 3412;
    const netkW = grosskW / 1.1;

    lastGrossKW = grosskW;
    lastNetKW = netkW;
    lastNetKWMode = 'imperial';

    const netKWDisplay = `<span id="netKW">${netkW.toFixed(2)}</span>`;
    result.innerHTML =
      `Gas Rate: ${gasRate.toFixed(2)} ft³/hr<br>` +
      `Gross Heat Input: ${grosskW.toFixed(2)} kW<br>` +
      `Net Heat Input: ${netKWDisplay} kW`;
    result.style.display = 'block';

    if (boiler) showBoilerInfo(boiler);
  } else {
    const initial = parseFloat(document.getElementById('initial').value);
    const final = parseFloat(document.getElementById('final').value);

    if (isNaN(initial) || isNaN(final) || final <= initial) {
      result.innerHTML = `
        <div style="text-align: center;">
          <span style="color: red; font-weight: bold;">⚠️ Please enter valid initial and final readings ⚠️</span>
        </div>`;
      result.style.display = 'block';

      setTimeout(() => {
        result.innerHTML = '';
        result.style.display = 'none';
      }, 3000);

      return;
    }

    volume = final - initial;

    const mode = document.getElementById('mode').value;
    duration = mode === 'manual'
      ? parseInt(document.getElementById('manualSeconds').value)
      : parseInt(document.getElementById('duration').value);

    const gasType = document.getElementById('gasType').value;
    const calorificValue = gasType === 'natural' ? 10.766666666666667 : 25.86111111;


    const gross = (3600 * volume * calorificValue) / duration;
    const net = gross / 1.11;

    const m3h = (3600 * volume) / duration;

    lastGrossKW = gross;
    lastNetKW = net;
    lastNetKWMode = 'metric';

    const netKWDisplay = `<span id="netKW">${net.toFixed(2)}</span>`;
    result.innerHTML =
      `Gas Rate: ${m3h.toFixed(2)} m³/hr<br>` +
      `Gross Heat Input: ${gross.toFixed(2)} kW<br>` +
      `Net Heat Input: ${netKWDisplay} kW`;
    result.style.display = 'block';

    if (boiler) showBoilerInfo(boiler);
  }

  result.scrollIntoView({ behavior: 'smooth' });
}



function resetTimerOnly() {
  clearInterval(countdown);
  clearInterval(stopwatchInterval);
  countdown = null;
  stopwatchInterval = null;
  time = 0;
  isPaused = false;

  const timeLeft = document.getElementById('timeLeft');
  const startBtn = document.getElementById('startBtn');

  const duration = parseInt(document.getElementById('duration').value);
  timeLeft.textContent = formatTime(imperialMode ? 0 : duration);

  timeLeft.classList.remove('highlight');
  startBtn.textContent = 'Start Timer';
  startBtn.style.display = 'inline-block';

  document.getElementById('calculateBtn').style.display = imperialMode ? 'none' : 'inline-block';
}

function resetForm() {
  resetTimerOnly();
  document.getElementById('initial').value = '';
  document.getElementById('final').value = '';
  document.getElementById('imperialVolume').value = imperialMode ? '0.991' : '';
  document.getElementById('result').textContent = '';
  document.getElementById('result').style.display = 'none';
  document.getElementById('calculateBtn').style.display = imperialMode ? 'none' : 'inline-block';
  document.getElementById('boilerResult').innerHTML = '';
  document.getElementById('gcNumber').value = '';

  // ✅ Clear any last calculated values
  lastNetKW = null;
  lastGrossKW = null;
  lastNetKWMode = null;
  document.getElementById('boilerFinder').style.display = 'none';

}


function setupGCInput() {
  const gcInput = document.getElementById('gcNumber');
  if (!gcInput) return;

  gcInput.addEventListener('input', function (e) {
    let raw = e.target.value;

    // If input is only digits or dashes, format it live
    if (/^\d*$/.test(raw.replace(/-/g, ''))) {
      let value = raw.replace(/\D/g, '');
      let formatted = '';
      if (value.length > 0) formatted += value.substring(0, 2);
      if (value.length >= 3) formatted += '-' + value.substring(2, 5);
      if (value.length >= 6) formatted += '-' + value.substring(5, 7);
      e.target.value = formatted;
    }
  });

  gcInput.addEventListener('keydown', function (e) {
    const pos = gcInput.selectionStart;
    const isFormattedGC = /^\d{2}-\d{3}-\d{2}$/.test(gcInput.value);

    if (isFormattedGC && (e.key === 'Backspace' || e.key === 'Delete') && (pos === 3 || pos === 7)) {
      e.preventDefault();
      gcInput.setSelectionRange(pos - 1, pos - 1);
    }
  });
  
}





let boilerDataLoaded = false;

function loadBoilerData() {
  const csvUrl = 'https://raw.githubusercontent.com/lexington1988/gas-rate-calculator/main/service_info_full.csv';


  Papa.parse(csvUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      window.boilerData = results.data;
      boilerDataLoaded = true;
      setupFuzzySearch(); // Rebuild fuzzy search after loading
    },
    error: function (err) {
      console.error("CSV load error:", err);
      showToast("❌ Failed to load boiler data from CSV");
    }
  });
}






function findBoilerByGC(gcInput) {
  const formattedGC = gcInput.trim().replace(/-/g, '');
  const boiler = window.boilerData?.find(entry =>
    (entry["GC Number"] || '').replace(/-/g, '') === formattedGC
  );

  if (boiler && !boiler.id) {
    console.warn("❗ Boiler found but missing Firestore ID");
  }

  return boiler;
}

// ✅ Ensures values like "31.11" display as "31.11 kW", but avoids duplicates like "31.11 kW kW"
function appendUnit(value, unit) {
  if (!value) return '';
  return value.toLowerCase().includes(unit.toLowerCase()) ? value : `${value} ${unit}`;
}


function showBoilerInfo(boiler) {
  currentGCNumber = boiler["GC Number"]?.trim();
  const make = boiler.Make?.trim() || '';
  const model = boiler.Model?.trim() || '';
  const gross = boiler['kW Gross'] || '';
  const net = boiler['kW Net'] || '';
 const netRange = boiler['Net kW (+5%/-10%)'] || '';

  const maxCO2 = boiler['Max CO2%'] || '';
const minCO2 = boiler['Min CO2%'] || '';

  const maxCO = boiler['Max Co (PPM)'] || '';

  const maxPressure = boiler['Max (Burner Pressure Mb)'] || '';
const minPressure = boiler['Min (Burner Pressure Mb)'] || '';

  const ratio = boiler['Max_Ratio'] || '';
 const stripRaw = boiler['Strip Service Required']?.trim().toLowerCase() || '';

  const strip = stripRaw === 'yes' ? 'yes' : stripRaw || 'no';

  let toleranceMessage = '';
  let netClass = '';

  const match = netRange.match(/([\d.]+)[^\d]+([\d.]+)/);
  if (match && lastNetKW !== null) {
    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);
    if (!isNaN(min) && !isNaN(max)) {
      const outOfRange = lastNetKW < min || lastNetKW > max;
      netClass = outOfRange ? 'red' : 'green';
      const messageText = outOfRange
        ? '⚠️ Outside of manufacturer’s tolerance'
        : '✅ Within manufacturer’s tolerance';

      toleranceMessage = `
        <div class="tolerance-message" style="grid-column: 1 / -1; font-weight: bold; color: ${outOfRange ? 'red' : 'green'};">
          ${messageText}
        </div>`;

      const resultBox = document.getElementById('result');
      if (resultBox && resultBox.style.display !== 'none') {
        const resultNetKW = document.getElementById('netKW');
        if (resultNetKW) {
          resultNetKW.classList.remove('green', 'red');
          resultNetKW.classList.add(outOfRange ? 'red' : 'green');
        }

        const oldMsg = resultBox.querySelector('.tolerance-message');
        if (oldMsg) oldMsg.remove();

        const msg = document.createElement('div');
        msg.className = 'tolerance-message';
        msg.style.color = outOfRange ? 'red' : 'green';
        msg.style.fontWeight = 'bold';
        msg.style.marginTop = '6px';
        msg.innerHTML = messageText;
        resultBox.appendChild(msg);
      }
    }
  }

  const field = (label, key, value) => {
    const inputHTML = isAdmin
      ? `<input data-key="${key}" value="${value}" style="width:100%;padding:4px;" />`
      : `<div class="value ${key === 'kW Net' ? netClass : ''}">${value}</div>`;
    return `<div><div class="label">${label}</div>${inputHTML}</div>`;
  };

  const html = `
    <div class="boiler-card">
 ${isAdmin ? `
  <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 15px;">
    <div style="display: flex; gap: 10px;">
      <button onclick="addNewBoiler()" style="background: #6a0dad; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold;">➕ Add New Boiler</button>
      <button onclick="deleteBoiler()" style="background: #6a0dad; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold;">🗑️ Delete Boiler</button>
    </div>
    <button onclick="downloadCSV()" style="background: #6a0dad; color: white; padding: 8px 20px; border-radius: 6px; font-weight: bold;">📥 Download CSV</button>
    <span style="font-size: 0.85rem; color: gray;"></span>
  </div>
` : ''}




      ${isAdmin 
        ? `<div style="display: flex; gap: 10px; margin-bottom: 10px;">
            ${field('Make', 'Make', make)}
            ${field('Model', 'Model', model)}
          </div>`
        : `<div class="boiler-title">${make} ${model}</div>`}

      <div class="boiler-grid">
        ${field('Net Heat Input', 'kW Net', appendUnit(net, 'kW'))}
        ${field('Net Heat Input Range', 'Net kW (+5%/-10%)', netRange)}
        ${field('Gross Heat Input', 'kW Gross', appendUnit(gross, 'kW'))}
        ${field('Max CO', 'Max Co (PPM)', appendUnit(maxCO, 'ppm'))}
          ${field('Max Burner Pressure (Mb)', 'Max Burner Pressure (Mb)', appendUnit(maxPressure, 'mb'))}
  ${field('Min Burner Pressure (Mb)', 'Min Burner Pressure (Mb)', appendUnit(minPressure, 'mb'))}

        ${isAdmin
  ? `
    <div style="display: flex; gap: 10px;">
      ${field('Max CO₂%', 'Max CO2%', maxCO2)}
      ${field('Min CO₂%', 'Min CO2%', minCO2)}
    </div>
  `
  : `<div><div class="label">CO₂ Range</div><div class="value">Max: ${maxCO2}%<br>Min: ${minCO2}%</div></div>`}


       

        ${isAdmin 
          ? field('Strip Service Required', 'Strip Service Required', strip)
          : `<div><div class="label">Strip Service Required</div><div class="value"><span class="tag ${strip === 'yes' ? 'yes' : 'no'}">${strip.charAt(0).toUpperCase() + strip.slice(1)}</span></div></div>`}

        ${toleranceMessage}
      </div>
      ${isAdmin ? '<button onclick="saveBoilerEdits()" style="margin-top:10px;">💾 Save Changes</button>' : ''}
    </div>
  `;

  document.getElementById('boilerResult').innerHTML = html;
  document.getElementById('boilerResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function addNewBoiler() {
  const gc = prompt("Enter new G.C. Number (7 digits):");
  if (!gc || !/^\d{7}$/.test(gc)) {
    alert("❌ Invalid G.C. Number. It must be 7 digits.");
    return;
  }

  const formattedGC = `${gc.slice(0, 2)}-${gc.slice(2, 5)}-${gc.slice(5, 7)}`;

  const exists = window.boilerData?.some(b => 
    (b["GC Number"] || '').replace(/\D/g, '') === gc
  );
  if (exists) {
    alert("❌ A boiler with this G.C. Number already exists.");
    return;
  }

  const newBoiler = {
    "GC Number": formattedGC,
    "Make": "",
    "Model": "",
    "kW Net": "",
    "kW Gross": "",
    "Net_kW_Tolerance": "",
    "Max_CO2": "",
    "Min_CO2": "",
    "Max_CO_PPM": "",
    "Max_Burner_Pressure": "",
    "Min_Burner_Pressure": "",
    "Max_Ratio": "",
    "Strip_Service": ""
  };

  window.boilerData.push(newBoiler);
  showToast("✅ New boiler added");
  showBoilerInfo(newBoiler);
}

function deleteBoiler() {
  if (!currentGCNumber) {
    alert("❌ No boiler selected.");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete boiler ${currentGCNumber}?`);
  if (!confirmDelete) return;

  const gc = currentGCNumber.replace(/-/g, '');
  window.boilerData = window.boilerData.filter(b => 
    (b["GC Number"] || '').replace(/\D/g, '') !== gc
  );

  showToast("🗑️ Boiler deleted");
  document.getElementById('boilerResult').innerHTML = '';
}


let toastTimeout;

function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;

  clearTimeout(toastTimeout); // clear any pending hides
  toast.textContent = message;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}







 document.addEventListener("DOMContentLoaded", () => {
  init();

  // ✅ Fix: attach logout button functionality
  const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

  
  // Your existing code...



  const useFirestore = true;
  if (useFirestore) {
    loadBoilerData(); // 🔁 Loads from GitHub CSV instead of Firestore

  } else {
    loadBoilerData(); // ⬅️ Your original CSV fallback function
  }

  // ✅ Enable Admin-only CSV uploader *after login*
  firebase.auth().onAuthStateChanged((user) => {
    if (user && isAdmin) {
      const uploader = document.getElementById('csvUploader');
      if (uploader) uploader.style.display = 'block';

      const uploadBtn = document.getElementById('uploadCSVButton');
      const fileInput = document.getElementById('csvFileInput');
      const statusDiv = document.getElementById('csvStatus');

      uploadBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
          alert("Please select a CSV file first.");
          return;
        }

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async function(results) {
            const rows = results.data;
            let success = 0;
            let failed = 0;

            statusDiv.innerHTML = `Uploading ${rows.length} boilers...`;

            for (const boiler of rows) {
              const gc = boiler["GC Number"]?.replace(/\D/g, '');
              if (!gc || gc.length !== 7) {
                failed++;
                continue;
              }

              const formattedGC = `${gc.slice(0, 2)}-${gc.slice(2, 5)}-${gc.slice(5, 7)}`;
              boiler["GC Number"] = formattedGC;

              try {
                await db.collection("boiler-data").doc(gc).set(boiler, { merge: true });
                success++;
              } catch (err) {
                console.error("❌ Error uploading:", boiler, err);
                failed++;
              }
            }

            statusDiv.innerHTML = `✅ ${success} uploaded, ❌ ${failed} failed.`;
          }
        });
      });
    }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered');

        // 🔁 Listen for updates
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // ✅ New version available
              showUpdateBanner();
            }
          };
        };
      })
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

// ✅ Theme-matching update banner
function showUpdateBanner() {
  const banner = document.createElement('div');
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #6a0dad;
      color: white;
      padding: 12px 18px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.95rem;
      z-index: 10000;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: background 0.3s ease;
    " title="Click to refresh and update">
      🔄 Update available — click to refresh
    </div>
  `;
  banner.onclick = () => {
    window.location.reload();
  };
  document.body.appendChild(banner);
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const fakeEmail = `${username}@fake.com`;

  firebase.auth().signInWithEmailAndPassword(fakeEmail, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;

      // 🔐 Create a unique session ID for this login
      currentSessionId = Math.random().toString(36).substring(2, 10);
      const sessionRef = db.collection("sessions").doc(uid);

      // ✅ Save this session in Firestore
      await sessionRef.set({ sessionId: currentSessionId }, { merge: true });

      // ✅ Listen for changes (to detect if someone else logs in)
      sessionRef.onSnapshot((doc) => {
        const data = doc.data();
        if (data && data.sessionId !== currentSessionId) {
          alert("⚠️ This account is now logged in on another device. Logging out...");
          logout();
        }
      });

      document.getElementById('loginError').textContent = '';
    })
    .catch((error) => {
      document.getElementById('loginError').textContent = '❌ ' + error.message;
    });
}

function logout() {
  const user = firebase.auth().currentUser;
  if (user) {
    db.collection("sessions").doc(user.uid).delete().catch(console.error);
  }

  firebase.auth().signOut()
    .then(() => {
      console.log('Logged out successfully');
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
}



function toggleAdminMode() {
  if (!isAdmin) {
    const pass = prompt("Enter admin password:");
    if (pass === "admin123") {
      isAdmin = true;
      document.body.classList.add('admin-mode');
      showToast("✅ Admin Mode enabled");
    } else {
      showToast("❌ Incorrect password");
    }
  } else {
    isAdmin = false;
    document.body.classList.remove('admin-mode');
    showToast("🔒 Admin Mode disabled");

    const uploader = document.getElementById('csvUploader');
    if (uploader) uploader.style.display = 'block';

    const uploadBtn = document.getElementById('uploadCSVButton');
    const fileInput = document.getElementById('csvFileInput');
    const statusDiv = document.getElementById('csvStatus');

    uploadBtn.addEventListener('click', () => {
      const file = fileInput.files[0];
      if (!file) {
        alert("Please select a CSV file first.");
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
          const rows = results.data;
          let success = 0;
          let failed = 0;

          statusDiv.innerHTML = `Uploading ${rows.length} boilers...`;

          for (const boiler of rows) {
            const gc = boiler["GC Number"]?.replace(/\D/g, '');
            if (!gc || gc.length !== 7) {
              failed++;
              continue;
            }

            const formattedGC = `${gc.slice(0, 2)}-${gc.slice(2, 5)}-${gc.slice(5, 7)}`;
            boiler["GC Number"] = formattedGC;

            // Do nothing here, just simulate
            success++;
          }

          statusDiv.innerHTML = `✅ ${success} loaded (not saved), ❌ ${failed} invalid.`;
        }
      });
    });
  }
}



function saveBoilerEdits() {
  const gcRaw = currentGCNumber ? currentGCNumber.replace(/-/g, '') : '';
  const boilerIndex = window.boilerData.findIndex(entry =>
    (entry["GC Number"] || '').replace(/\D/g, '') === gcRaw
  );

  if (boilerIndex === -1) {
    alert("❌ GC number not found in memory.");
    return;
  }

  const inputs = document.querySelectorAll('#boilerResult input[data-key]');
  const keyMap = {
  "Make": "Make",
  "Model": "Model",
  "kW Net": "kW Net",
  "kW Gross": "kW Gross",
  "Net kW (+5%/-10%)": "Net kW (+5%/-10%)",
  "Max CO₂%": "Max CO2%",
  "Min CO₂%": "Min CO2%",
  "Max Co (PPM)": "Max Co (PPM)",
  "Max Burner Pressure (Mb)": "Max (Burner Pressure Mb)",
  "Min Burner Pressure (Mb)": "Min (Burner Pressure Mb)",
  "Max Ratio": "Max Ratio",
  "Strip Service Required": "Strip Service Required"
};


  inputs.forEach(input => {
    const rawKey = input.getAttribute('data-key');
    const safeKey = keyMap[rawKey] || rawKey;
    let val = input.value.trim();

    val = val.replace(/\bkW\b|\bppm\b|\bmb\b|[%°]/gi, '').trim();
    if (val.length > 200) val = val.slice(0, 200);
    val = val.replace(/[<>]/g, '').replace(/[\u0000-\u001F\u007F]/g, '');

    window.boilerData[boilerIndex][safeKey] = val;
  });

  showToast("✅ Changes saved (in memory)");
  showBoilerInfo(window.boilerData[boilerIndex]);
}
function downloadCSV() {
  if (!window.boilerData || window.boilerData.length === 0) {
    showToast("❌ No boiler data to export.");
    return;
  }

  const csv = Papa.unparse(window.boilerData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "boiler-data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("📥 CSV downloaded successfully");
}
