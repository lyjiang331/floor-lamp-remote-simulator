// These variables are the appliance's current state.
let isOn = false;
let brightness = 50;
let temperatureIndex = 1;
let currentMode = "Custom";
let timerIsSet = false;
let timerSecondsRemaining = 60 * 60;
let timerIntervalId = null;

// The remote moves through a fixed set of color-temperature states.
const temperatures = [
  { kelvin: 2700, label: "Warm yellow", color: "#ffc86e" },
  { kelvin: 4500, label: "Neutral white", color: "#fff0c8" },
  { kelvin: 6500, label: "Cool daylight", color: "#cfe6ff" }
];

const room = document.querySelector("#room");
const powerButton = document.querySelector("#powerButton");
const powerStatus = document.querySelector("#powerStatus");
const brightnessReadout = document.querySelector("#brightnessReadout");
const temperatureReadout = document.querySelector("#temperatureReadout");
const modeReadout = document.querySelector("#modeReadout");
const timerStatus = document.querySelector("#timerStatus");
const timerButton = document.querySelector("#timerButton");
const timerButtonState = document.querySelector("#timerButtonState");
const message = document.querySelector("#message");
const logicResult = document.querySelector("#logicResult");
const branchPowerOff = document.querySelector("#branchPowerOff");
const branchPreset = document.querySelector("#branchPreset");
const branchCustom = document.querySelector("#branchCustom");
const branchTimerOn = document.querySelector("#branchTimerOn");
const branchTimerOff = document.querySelector("#branchTimerOff");
const stateControlButtons = document.querySelectorAll(
  "#brightnessDown, #brightnessUp, .temperature-button, .preset-button, #timerButton"
);

function showMessage(text) {
  message.textContent = text;
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map(function (number) { return String(number).padStart(2, "0"); })
    .join(":");
}

function stopTimer(resetTime) {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  timerIsSet = false;

  if (resetTime) {
    timerSecondsRemaining = 60 * 60;
  }
}

function renderLogic() {
  const presetIsActive = isOn && currentMode !== "Custom";
  branchPowerOff.classList.toggle("active", !isOn);
  branchPreset.classList.toggle("active", presetIsActive);
  branchCustom.classList.toggle("active", isOn && !presetIsActive);
  branchTimerOn.classList.toggle("active", isOn && timerIsSet);
  branchTimerOff.classList.toggle("active", !timerIsSet);

  if (!isOn) {
    logicResult.textContent = "IF → power is off";
  } else if (presetIsActive) {
    logicResult.textContent = `ELSE IF → ${currentMode} preset`;
  } else {
    logicResult.textContent = "ELSE → custom control";
  }
}

// One render function keeps all visual feedback synchronized with the state.
function renderLamp() {
  const temperature = temperatures[temperatureIndex];
  const lightStrength = isOn ? brightness / 100 : 0;

  room.classList.toggle("is-on", isOn);
  room.style.setProperty("--lamp-color", temperature.color);
  room.style.setProperty("--lamp-alpha", lightStrength);
  room.style.backgroundColor = isOn
    ? `color-mix(in srgb, ${temperature.color} ${Math.round(brightness * 0.17)}%, #1d2927)`
    : "#1d2927";

  powerButton.setAttribute("aria-pressed", String(isOn));
  powerStatus.innerHTML = `<i></i> Lamp ${isOn ? "on" : "off"}`;
  brightnessReadout.textContent = isOn ? `${brightness}%` : "—";
  temperatureReadout.textContent = isOn
    ? `${temperature.label} · ${temperature.kelvin}K`
    : "—";
  modeReadout.textContent = isOn ? currentMode : "Off";

  stateControlButtons.forEach(function (button) {
    button.disabled = !isOn;
  });

  document.querySelectorAll(".preset-button").forEach(function (button) {
    button.classList.toggle("active", isOn && button.dataset.mode === currentMode);
  });

  document.querySelectorAll(".temperature-button").forEach(function (button, index) {
    button.classList.toggle("active", isOn && index === temperatureIndex);
  });

  timerStatus.textContent = timerIsSet && isOn ? formatTime(timerSecondsRemaining) : "Timer off";
  timerButtonState.textContent = timerIsSet
    ? `Cancel · ${formatTime(timerSecondsRemaining)}`
    : "Start 01:00:00";
  timerButton.setAttribute("aria-pressed", String(timerIsSet && isOn));
  renderLogic();
}

function togglePower() {
  isOn = !isOn;

  if (isOn) {
    showMessage("Lamp turned on. Try changing brightness, color, or mode.");
  } else {
    stopTimer(true);
    showMessage("Lamp turned off. Other controls are now disabled.");
  }

  renderLamp();
}

function changeBrightness(amount) {
  const nextBrightness = brightness + amount;

  if (nextBrightness > 100) {
    brightness = 100;
    showMessage("The lamp is already at maximum brightness.");
  } else if (nextBrightness < 10) {
    brightness = 10;
    showMessage("10% is the minimum brightness for this lamp.");
  } else {
    brightness = nextBrightness;
    currentMode = "Custom";
    showMessage(`Brightness changed to ${brightness}%.`);
  }

  renderLamp();
}

function setTemperature(level) {
  if (level === "warm") {
    temperatureIndex = 0;
  } else if (level === "neutral") {
    temperatureIndex = 1;
  } else if (level === "cool") {
    temperatureIndex = 2;
  }

  currentMode = "Custom";
  showMessage(`Color changed to ${temperatures[temperatureIndex].label}.`);
  renderLamp();
}

// Presets demonstrate control flow: one action changes several state variables.
function applyPreset(mode) {
  if (mode === "Office") {
    brightness = 100;
    temperatureIndex = 2;
  } else if (mode === "Sleep") {
    brightness = 10;
    temperatureIndex = 0;
  } else if (mode === "Study") {
    brightness = 80;
    temperatureIndex = 1;
  } else if (mode === "K") {
    brightness = 60;
    temperatureIndex = 1;
  } else if (mode === "Baby") {
    brightness = 30;
    temperatureIndex = 0;
  }

  currentMode = mode;
  showMessage(`${mode} mode changed both brightness and color temperature.`);
  renderLamp();
}

function toggleTimer() {
  if (timerIsSet) {
    stopTimer(true);
    showMessage("ELSE branch: the running timer was cancelled and reset.");
  } else {
    timerIsSet = true;
    timerSecondsRemaining = 60 * 60;
    showMessage("IF branch: timer is on, so the countdown subtracts one second at a time.");

    timerIntervalId = setInterval(function () {
      timerSecondsRemaining = timerSecondsRemaining - 1;

      if (timerSecondsRemaining <= 0) {
        stopTimer(true);
        isOn = false;
        showMessage("Nested IF branch: time reached 00:00:00, so the lamp turned off.");
      }

      renderLamp();
    }, 1000);
  }

  renderLamp();
}

// Events connect each user action to a state transition.
powerButton.addEventListener("click", togglePower);
document.querySelector("#brightnessDown").addEventListener("click", function () {
  changeBrightness(-10);
});
document.querySelector("#brightnessUp").addEventListener("click", function () {
  changeBrightness(10);
});
document.querySelectorAll(".temperature-button").forEach(function (button) {
  button.addEventListener("click", function () {
    setTemperature(button.dataset.temperature);
  });
});
timerButton.addEventListener("click", toggleTimer);

document.querySelectorAll(".preset-button").forEach(function (button) {
  button.addEventListener("click", function () {
    applyPreset(button.dataset.mode);
  });
});

renderLamp();
