// ============================================================
// dashboard.js
// Fills the dashboard with summary numbers and recent products.
// ============================================================

import { getProducts } from "./storage.js";
import { requireLogin, getCurrentUser, logout } from "./auth.js";

// Protect this page - send visitors to login if not logged in.
requireLogin();

// Show the logged-in user's name in the navbar.
document.getElementById("user-name").textContent =
  "Hi, " + getCurrentUser();

// Log out button: clear the login and go back to the login page.
document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
  window.location.href = "index.html";
});

// Read all products from Local Storage.
const products = getProducts();

// ----- Calculate the stats -----
// Total number of products.
const total = products.length;

// Products that are "in stock" means quantity is more than 10.
const inStock = products.filter((p) => p.quantity > 10).length;

// "Low stock" means quantity is between 1 and 10.
const lowStock = products.filter(
  (p) => p.quantity >= 1 && p.quantity <= 10
).length;

// Total value = price x quantity for every product, added together.
const totalValue = products.reduce(
  (sum, p) => sum + Number(p.price) * Number(p.quantity),
  0
);

// Put the numbers on the page.
document.getElementById("stat-total").textContent = total;
document.getElementById("stat-in-stock").textContent = inStock;
document.getElementById("stat-low-stock").textContent = lowStock;
document.getElementById("stat-value").textContent =
  "Rs." + totalValue.toLocaleString();

// ----- Show the 5 most recent products -----
// Sort newest first (biggest id first), then take the first 5.
const recent = [...products]
  .sort((a, b) => Number(b.id) - Number(a.id))
  .slice(0, 5);

const recentBody = document.getElementById("recent-products");

if (recent.length === 0) {
  // No products yet - show a friendly message.
  recentBody.innerHTML = `
    <tr>
      <td colspan="5">
        <div class="empty-state">
          <div class="empty-icon">&#128230;</div>
          <h3>No products yet</h3>
          <p>Add your first product to get started.</p>
        </div>
      </td>
    </tr>`;
} else {
  // Build a table row for each recent product.
  recentBody.innerHTML = recent
    .map((p) => {
      const status = stockBadge(p.quantity);
      return `
        <tr>
          <td class="product-name">${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.category)}</td>
          <td>Rs.${Number(p.price).toLocaleString()}</td>
          <td>${p.quantity}</td>
          <td>${status}</td>
        </tr>`;
    })
    .join("");
}

// ----- Helper functions -----

// Return a colored badge depending on the quantity.
function stockBadge(quantity) {
  if (quantity === 0) {
    return '<span class="badge badge-out-stock">Out of stock</span>';
  }
  if (quantity <= 10) {
    return '<span class="badge badge-low-stock">Low stock</span>';
  }
  return '<span class="badge badge-in-stock">In stock</span>';
}

// Change special characters so they display safely in the table.
// This prevents broken HTML if a product name has <, >, or & in it.
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
