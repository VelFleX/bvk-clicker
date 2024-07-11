const setCash = (key, value) => localStorage.setItem(key, value);
const getCash = (key) => localStorage.getItem(key);

const coin = document.getElementById("coin");
const counter = document.getElementById("coins-counter");
counter.textContent = (getCash("clicks") || 0) + " BVK";

let clicks = getCash("clicks") || 0;
const slogan = document.getElementById("slogan");

const updateSlogan = (clicks) => {
  if (clicks < 10) {
    slogan.textContent = "Внуку помогай маслёнок";
  } else if (clicks >= 100) {
    slogan.textContent = "Всем всё платится";
  } else if (clicks >= 500) {
    slogan.textContent = "Банду Елькина под суд!";
  } else if (clicks >= 1000) {
    slogan.textContent = "Десятник";
  } else if (clicks >= 2000) {
    slogan.textContent = "Адепт";
  } else if (clicks >= 5000) {
    slogan.textContent = "5тыщ 5тыщ";
  } else if (clicks >= 10000) {
    slogan.textContent = "Внук Мавроди";
  }
};

updateSlogan(clicks);

coin.addEventListener("click", function (e) {
  const number = document.createElement("div");
  number.classList.add("number");
  number.style.left = e.clientX + "px";
  number.style.top = e.clientY + "px";
  number.innerText = "+1";
  document.getElementById("root").appendChild(number);

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
});

document.getElementById("reload").addEventListener("click", function () {
  location.reload(true);
});
