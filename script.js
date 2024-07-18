const version = "0.1.6.1";
const $version = document.getElementById("version");
$version.textContent = version;

const setCash = (key, value) => localStorage.setItem(key, value);
const getCash = (key) => localStorage.getItem(key);

const coin = document.getElementById("coin");
const coinsValue = parseInt(getCash("coins")) || 0;
const counter = document.getElementById("coins-counter");
let clicks = parseInt(getCash("clicks")) || 0;
counter.textContent = clicks.toLocaleString() + " BVK";
const slogan = document.getElementById("slogan");

const energyCap = document.getElementById("energyCap");
const currentEnergy = document.getElementById("currentEnergy");
const energyBar = document.getElementById("energyBar");
let energyCapValue = parseInt(getCash("energyCap")) || 1000;
let currentEnergyValue = parseInt(getCash("currentEnergy")) || 0;

const userLevel = document.getElementById("level");
const expCap = document.getElementById("expCap");
const currentExp = document.getElementById("currentExp");
const expBar = document.getElementById("expBar");
let userLevelValue = parseInt(getCash("userLevel")) || 1;
let expCapValue = parseInt(getCash("expCap")) || calculateExp(userLevelValue);
let currentExpValue = parseInt(getCash("currentExp")) || 0;

(function loadEnergy() {
  const lastEnergyRegen = parseInt(getCash("lastEnergyRegen")) || Date.now();
  const timePassed = Date.now() - lastEnergyRegen;
  currentEnergyValue = Math.min(Math.floor(timePassed / 1800 + currentEnergyValue), energyCapValue);
  updateEnergyBar();
  energyCap.textContent = energyCapValue;
  setCash("currentEnergy", currentEnergyValue);
  if (timePassed > 1800) setCash("lastEnergyRegen", Date.now());
})();

(function loadExp() {
  userLevel.textContent = userLevelValue;
  expCap.textContent = expCapValue;
  updateExpBar();
})();

const updateSlogan = (clicks) => {
  if (clicks >= 50000) {
    slogan.textContent = "Богосатана";
  } else if (clicks >= 10000) {
    slogan.textContent = "Внук Мавроди";
  } else if (clicks >= 5000) {
    slogan.textContent = "5тыщ 5тыщ";
  } else if (clicks >= 2000) {
    slogan.textContent = "Адепт";
  } else if (clicks >= 1000) {
    slogan.textContent = "Десятник";
  } else if (clicks >= 500) {
    slogan.textContent = "Банду Елькина под суд!";
  } else if (clicks >= 100) {
    slogan.textContent = "Всем всё платится";
  } else {
    slogan.textContent = "Внуку помогай маслёнок";
  }
};

updateSlogan(clicks);

function handleEvent(e) {
  const number = document.createElement("div");
  number.classList.add("number");
  number.style.left = e.clientX + "px";
  number.style.top = e.clientY + "px";
  number.innerText = "+1";
  document.getElementById("root").appendChild(number);
}

let touch = false;
let touchStartTime = 0;

coin.addEventListener("touchstart", function (e) {
  touchStartTime = Date.now();
  if (e.touches.length > 0) {
    touch = true;
  }
});

coin.addEventListener("touchmove", function (e) {
  if (isRealTouch && e.touches.length > 0) {
    touch = true;
  } else {
    touch = false;
  }
});

coin.addEventListener("touchend", function (e) {
  if (!touch) return;
  touch = false;
  // if (Date.now() - touchStartTime < 50) return;
  if (currentEnergyValue <= 0) return;
  handleEvent(e.changedTouches[0]);

  setTimeout(function () {
    number.remove();
  }, 1000);

  this.style.transform = "scale(1.04)";
  setTimeout(() => {
    this.style.transform = "";
  }, 100);

  clicks++;
  setCash("clicks", clicks);
  updateSlogan(clicks);
  counter.textContent = clicks.toLocaleString() + " BVK";

  decEnergy(1);
  addExp(1);
  e.preventDefault();
});

const pages = document.querySelectorAll(".page");
const footerBtns = document.querySelectorAll(".footer__button");

footerBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    pages.forEach((page) => {
      page.classList.add("display-none");
    });
    document.getElementById(btn.textContent.toLocaleLowerCase()).classList.remove("display-none");
  });
});

function updateEnergyBar() {
  energyBar.style.width = `${(currentEnergyValue / energyCapValue) * 100}%`;
  currentEnergy.textContent = currentEnergyValue;
}

function updateExpBar() {
  expBar.style.width = `${(currentExpValue / expCapValue) * 100}%`;
  currentExp.textContent = currentExpValue;
}

function decEnergy(value) {
  currentEnergyValue -= value;
  updateEnergyBar();
  setCash("currentEnergy", currentEnergyValue);
  setCash("lastEnergyRegen", Date.now());
}

function addEnergy(value) {
  if (currentEnergyValue < energyCapValue) {
    currentEnergyValue += value;
    updateEnergyBar();
    setCash("currentEnergy", currentEnergyValue);
    setCash("lastEnergyRegen", Date.now());
  }
}

function addExp(value) {
  if (currentExpValue + value < expCapValue) {
    currentExpValue += value;
    updateExpBar();
    setCash("currentExp", currentExpValue);
  } else if (currentExpValue + value >= expCapValue) {
    userLevelValue++;
    currentExpValue = Math.abs(expCapValue - currentExpValue - value);
    const newCap = calculateExp(userLevelValue);
    expCapValue = newCap;
    expCap.textContent = newCap;
    updateExpBar();
    userLevel.textContent = userLevelValue;
    setCash("currentExp", currentExpValue);
    setCash("userLevel", userLevelValue);
    setCash("expCap", newCap);
  }
}

function calculateExp(level) {
  if (level < 1) return 0;
  const baseExperience = 100 * level;
  const growthMultiplier = 1.15;
  return parseInt(baseExperience * Math.pow(growthMultiplier, level - 1));
}

setInterval(() => currentEnergyValue !== energyCapValue && addEnergy(1), 1800);
ву;
