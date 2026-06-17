import "@babel/polyfill";
// import { displayMap } from './mapbox';
import { login, logout } from "./login";
// import { updateSettings } from './updateSettings';

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");

// DELEGATION

if (mapBox) {
  const locations = JSON.parse(
    mapBox.dataset.location || mapBox.dataset.locations || "[]",
  );
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);
