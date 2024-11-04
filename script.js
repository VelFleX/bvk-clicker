const version = "0.1.7";
const $version = document.getElementById("version");
$version.textContent = "v" + version;

const user = window.Telegram?.WebApp.initDataUnsafe.user || {};
const username = user?.username ? "@" + user?.username : "anon";
const userAvatarLink = user?.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
document.getElementById("username").textContent = username;
document.getElementById("user-avatar").src = userAvatarLink;
console.log(user);

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
  const slogans = {
    9000000000000000: "Богосатана",
    1000000000000000: "Бог денег",
    100000000000000: "Архидемон Финансов",
    10000000000000: "Повелитель Блокчейнов",
    1000000000000: "Магнат Триллионов",
    100000000000: "Великий Царь Цифры",
    10000000000: "Император Кодекса",
    1000000000: "Царь Новой Эры",
    100000000: "Техно-Мастер",
    10000000: "Архитектор Пирамиды",
    1000000: "Верховный Иллюминат",
    500000: "Бог Криптокошелька",
    100000: "Криптофеодал",
    50000: "Проповедник Золотого Тельца",
    25000: "Виртуоз Кодирования",
    10000: "Шейх Биткоина",
    5000: "Внук Мавроди",
    2000: "Адепт Пирамиды",
    1000: "Десятник Криптовалюты",
    500: "Координатор Сетевого Бога",
    250: "Скромный Продавец Душ",
    100: "Ученик Падшего Банкира",
    50: "Собиратель Цифровых Монет",
    25: "Посланник Рынка",
    10: "Начинающий Пророк",
    5: "Ученик Культа",
    0: "Новичок",
  };

  const sortedKeys = Object.keys(slogans)
    .map(Number)
    .sort((a, b) => b - a);
  for (const clicksThreshold of sortedKeys) {
    if (clicks >= clicksThreshold) {
      slogan.textContent = slogans[clicksThreshold];
      break;
    }
  }
};

updateSlogan(clicks);

function handleEvent(e) {
  const number = document.createElement("div");
  number.classList.add("number");
  number.style.left = e.clientX + "px";
  number.style.top = e.clientY + "px";
  number.innerText = `+${userLevelValue}`;
  document.getElementById("root").appendChild(number);
}

let touch = false;
let touchStartTime = 0;

coin.addEventListener("touchstart", function (e) {
  touchStartTime = performance.now();
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
  if (performance.now() - touchStartTime < 25) return;
  if (currentEnergyValue <= 0) return;
  handleEvent(e.changedTouches[0]);

  setTimeout(function () {
    number.remove();
  }, 1000);

  this.style.transform = "scale(1.04)";
  setTimeout(() => {
    this.style.transform = "";
  }, 100);

  clicks += userLevelValue;
  setCash("clicks", clicks);
  updateSlogan(clicks);
  counter.textContent = clicks.toLocaleString() + " BVK";

  decEnergy(1);
  addExp(userLevelValue);
  e.preventDefault();
});

const pages = document.querySelectorAll(".page");
const footerBtns = document.querySelectorAll(".navigation-btn");

footerBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    footerBtns.forEach((btn) => {
      btn.classList.remove("navigation-btn--active");
    });
    e.target.classList.add("navigation-btn--active");
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
