// ============================================================
// auth.js
// Handles the dummy login and keeps track of who is logged in.
// This is NOT real security - it is just for learning purposes.
// ============================================================

// The dummy username and password. In a real app this would be
// checked on a secure server, but here we keep it simple.
const DUMMY_USER = "nihal";
const DUMMY_PASSWORD = "nihal123";

// The key used to remember that someone is logged in.
const SESSION_KEY = "ims_session";

// Try to log in. Returns true if it worked, false if not.
function login(username, password) {
  if (username === DUMMY_USER && password === DUMMY_PASSWORD) {
    // Save the login so the user stays logged in.
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
    return true;
  }
  return false;
}

// Log the user out and remove the saved login.
function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// Check if someone is logged in right now.
function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) !== null;
}

// Get the username of the logged-in person (or null).
function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw).username;
  } catch (error) {
    return null;
  }
}

// Use this on pages that should only be seen after login.
// If nobody is logged in, send them to the login page.
function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  }
}

export { login, logout, isLoggedIn, getCurrentUser, requireLogin };
