import "@babel/polyfill";
// import { displayMap } from './mapbox';
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSetting";
import { bookTour } from "./Paystack";
import {createReview} from "./review"

const mapBox = document.getElementById("map");
const signupForm = document.querySelector(".form--signup");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const createReviewForm = document.querySelector(".form-review");

// DELEGATION

if (mapBox) {
  const locations = JSON.parse(
    mapBox.dataset.location || mapBox.dataset.locations || "[]",
  );
  displayMap(locations);
}

if (createReviewForm)
  createReviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const review = document.getElementById("review").value;
    const rating = document.getElementById("rating").value;
    const tourId = createReviewForm.dataset.tourId;
    createReview(tourId,review,rating);
  });

if (signupForm)
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    signup(name, email, password, passwordConfirm);
  });

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    console.log(form);

    updateSettings(form, "data");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password",
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

const bookBtn = document.getElementById("book-tour");

if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";

    const { tourId } = e.target.dataset;

    bookTour(tourId);
  });

const reviewBtn = document.getElementById("show-review-form");

if (reviewBtn)
  reviewBtn.addEventListener("click", () => {
    const reviewSection = document.getElementById("review-form");
    if (!reviewSection) return;

    reviewSection.style.display = "block";
    reviewSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
