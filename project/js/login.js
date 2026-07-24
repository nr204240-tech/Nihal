// ============================================================
// login.js
// Handles the login form on the login page.
// ============================================================

import { login, isLoggedIn } from "./auth.js";

// If the user is already logged in, skip the login page.
if (isLoggedIn()) {
  window.location.href = "dashboard.html";
}

// Grab the form and error message box from the page.
const form = document.getElementById("login-form");
const errorBox = document.getElementById("login-error");

// When the form is submitted, try to log in.
form.addEventListener("submit", (event) => {
  // Stop the page from reloading when the form is sent.
  event.preventDefault();

  // Read what the user typed.
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Try logging in with the dummy check.
  const success = login(username, password);

  if (success) {
    // Send the user to the dashboard.
    window.location.href = "dashboard.html";
  } else {
    // Show an error message.
    errorBox.textContent = "Wrong username or password. Please try again.";
    errorBox.classList.add("show");
  }
});
