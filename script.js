const setCash = (key, value) => localStorage.setItem(key, value);
const getCash = (key) => localStorage.getItem(key);

const coin = document.getElementById("coin");
const counter = document.getElementById("coins-counter");
counter.textContent = (getCash("clicks") || 0) + " BVK";

let clicks = getCash("clicks") || 0;
if (clicks > 0) {
  const slogan = document.getElementById("slogan");
  slogan.textContent = "Внуку помогай";
}

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
  counter.textContent = clicks.toLocaleString() + " BVK";
});

document.getElementById("reload").addEventListener("click", function () {
  location.reload(true);
});
