let isRunning = false;
let loopInterval = null;

const spookyBtn = document.getElementById("spookyBtn");
const intervalInput = document.getElementById("interval");
const customColorInput = document.getElementById("customColor");
const intensityInput = document.getElementById("intensity");
const bulbSizeInput = document.getElementById("bulbSize");
const rowCountInput = document.getElementById("rowCount");
const gridContainer = document.getElementById("gridContainer");

const initialBulbClasses = [
  "purple",
  "orange",
  "red",
  "green",
  "white",
  "orange",
  "purple",
];

function updateStyles() {
  document.documentElement.style.setProperty(
    "--bulb-size",
    `${bulbSizeInput.value}px`,
  );
  document.documentElement.style.setProperty(
    "--intensity",
    intensityInput.value,
  );
}

function renderDisplayRows() {
  // Clear only existing rows, preserving fixed decoration containers
  const existingRows = gridContainer.querySelectorAll(".lights");
  existingRows.forEach((row) => row.remove());

  const rowTotal = parseInt(rowCountInput.value) || 1;

  for (let r = 0; r < rowTotal; r++) {
    const rowSection = document.createElement("section");
    rowSection.className = "lights";

    initialBulbClasses.forEach((colorClass) => {
      const bulb = document.createElement("div");
      bulb.className = `light-bulb ${colorClass}`;
      rowSection.appendChild(bulb);
    });

    // Inserts rows neatly before the floating decoration wrappers
    const firstCorner = gridContainer.querySelector(".spooky-corner");
    if (firstCorner) {
      gridContainer.insertBefore(rowSection, firstCorner);
    } else {
      gridContainer.appendChild(rowSection);
    }
  }

  if (isRunning) updateLightsDisplay();
}

function updateLightsDisplay() {
  const allBulbs = document.querySelectorAll(".light-bulb");
  const customColor = customColorInput.value;

  allBulbs.forEach((bulb) => {
    const turnOn = Math.random() > 0.5;

    if (turnOn) {
      bulb.classList.add("glow");
      if (customColor !== "#ff5500") {
        bulb.style.backgroundColor = customColor;
        bulb.style.boxShadow = `0 0 25px ${customColor}, 0 0 50px ${customColor}`;
      } else {
        bulb.style.backgroundColor = "";
        bulb.style.boxShadow = "";
      }
    } else {
      bulb.classList.remove("glow");
      bulb.style.backgroundColor = "";
      bulb.style.boxShadow = "";
    }
  });
}

function toggleDisplay() {
  if (isRunning) {
    clearInterval(loopInterval);
    isRunning = false;
    spookyBtn.textContent = "Start Display";

    document.querySelectorAll(".light-bulb").forEach((bulb) => {
      bulb.classList.remove("glow");
      bulb.style.backgroundColor = "";
      bulb.style.boxShadow = "";
    });
  } else {
    isRunning = true;
    spookyBtn.textContent = "Stop Display";
    startLoop();
  }
}

function startLoop() {
  if (loopInterval) clearInterval(loopInterval);
  const ms = parseInt(intervalInput.value) || 500;
  loopInterval = setInterval(updateLightsDisplay, ms);
}

spookyBtn.addEventListener("click", toggleDisplay);
intervalInput.addEventListener("input", () => {
  if (isRunning) startLoop();
});
bulbSizeInput.addEventListener("input", updateStyles);
intensityInput.addEventListener("input", updateStyles);
rowCountInput.addEventListener("input", renderDisplayRows);
customColorInput.addEventListener("input", () => {
  if (isRunning) updateLightsDisplay();
});

// Run configuration setup immediately on startup
updateStyles();
renderDisplayRows();
