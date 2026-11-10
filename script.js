// These variables are the appliance's current state.
let isOn = false;
let brightness = 50;
let temperatureIndex = 2;
let currentMode = "Custom";
let timerIsSet = false;

// The remote moves through a fixed set of color-temperature states.
const temperatures = [
  { kelvin: 2700, label: "Warm yellow", color: "#ffc86e" },
  { kelvin: 3500, label: "Warm white", color: "#ffdca0" },
  { kelvin: 4500, label: "Neutral white", color: "#fff0c8" },
  { kelvin: 5500, label: "Cool white", color: "#e6f2ff" },
  { kelvin: 6500, label: "Daylight", color: "#cfe6ff" }
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
const stateControlButtons = document.querySelectorAll(
  "#brightnessDown, #brightnessUp, #warmerButton, #coolerButton, .preset-button, #timerButton"
);

function showMessage(text) {
  message.textContent = text;
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

  timerStatus.textContent = timerIsSet && isOn ? "1H timer set" : "Timer off";
  timerButtonState.textContent = timerIsSet ? "Cancel timer" : "Set timer";
  timerButton.setAttribute("aria-pressed", String(timerIsSet && isOn));
}

function togglePower() {
  isOn = !isOn;

  if (isOn) {
    showMessage("Lamp turned on. Try changing brightness, color, or mode.");
  } else {
    timerIsSet = false;
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

function changeTemperature(direction) {
  const nextIndex = temperatureIndex + direction;

  if (nextIndex < 0) {
    temperatureIndex = 0;
    showMessage("This is the warmest color setting.");
  } else if (nextIndex >= temperatures.length) {
    temperatureIndex = temperatures.length - 1;
    showMessage("This is the coolest color setting.");
  } else {
    temperatureIndex = nextIndex;
    currentMode = "Custom";
    showMessage(`Color changed to ${temperatures[temperatureIndex].label}.`);
  }

  renderLamp();
}

// Presets demonstrate control flow: one action changes several state variables.
function applyPreset(mode) {
  if (mode === "Office") {
    brightness = 100;
    temperatureIndex = 4;
  } else if (mode === "Sleep") {
    brightness = 10;
    temperatureIndex = 0;
  } else if (mode === "Study") {
    brightness = 80;
    temperatureIndex = 2;
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
  timerIsSet = !timerIsSet;
  showMessage(
    timerIsSet
      ? "The lamp is set to turn off after one hour (simulated)."
      : "The auto-off timer was cancelled."
  );
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
document.querySelector("#warmerButton").addEventListener("click", function () {
  changeTemperature(-1);
});
document.querySelector("#coolerButton").addEventListener("click", function () {
  changeTemperature(1);
});
timerButton.addEventListener("click", toggleTimer);

document.querySelectorAll(".preset-button").forEach(function (button) {
  button.addEventListener("click", function () {
    applyPreset(button.dataset.mode);
  });
});

renderLamp();
