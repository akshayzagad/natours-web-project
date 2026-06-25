import "@babel/polyfill";
// import { displayMap } from './mapbox';
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateSetting";
import { bookTour } from "./Paystack";
import { createReview, deleteReview, editReview } from "./review";
import { showAlert } from "./alert";

const mapBox = document.getElementById("map");
const signupForm = document.querySelector(".form--signup");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const createReviewForm = document.querySelector(".form-review");
const editReviewForm = document.querySelector(".form-edit-review");
const editReviewModal = document.querySelector(".review-modal");
const editReviewCloseBtn = document.querySelector(".review-modal__close");
const editReviewOverlay = document.querySelector(".review-modal__overlay");

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
    createReview(tourId, review, rating);
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
    // console.log(form);

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

const deleteBtns = document.querySelectorAll(".delete-review");

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const reviewId = btn.dataset.reviewId;

    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId);
    }
  });
});

const closeEditReviewModal = () => {
  if (!editReviewModal) return;
  editReviewModal.classList.add("hidden");
};

const editBtns = document.querySelectorAll(".edit-review");

editBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!editReviewModal || !editReviewForm) return;

    editReviewForm.dataset.reviewId = btn.dataset.reviewId;
    document.getElementById("edit-review").value = btn.dataset.review || "";
    document.getElementById("edit-rating").value = btn.dataset.rating || "";
    editReviewModal.classList.remove("hidden");
  });
});

if (editReviewCloseBtn)
  editReviewCloseBtn.addEventListener("click", closeEditReviewModal);

if (editReviewOverlay)
  editReviewOverlay.addEventListener("click", closeEditReviewModal);

if (editReviewForm)
  editReviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const reviewId = editReviewForm.dataset.reviewId;
    const review = document.getElementById("edit-review").value;
    const rating = document.getElementById("edit-rating").value;

    editReview(reviewId, review, rating);
  });

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 20);
