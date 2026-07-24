// ============================================================
// products.js
// Shows the full products list, handles search, and deletes.
// ============================================================

import { getProducts, deleteProduct } from "./storage.js";
import { requireLogin, getCurrentUser, logout } from "./auth.js";

// Protect this page.
requireLogin();

// Show username and set up the logout button.
document.getElementById("user-name").textContent = "Hi, " + getCurrentUser();
document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
  window.location.href = "index.html";
});

// Grab the table body and the search box.
const tableBody = document.getElementById("products-table");
const searchInput = document.getElementById("search-input");

// Show the products. If "query" is given, only show matches.
function renderProducts(query = "") {
  let products = getProducts();

  // If there is a search query, filter the list.
  if (query) {
    const lowerQuery = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }

  // If nothing is left, show an empty message.
  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <div class="empty-icon">&#128269;</div>
            <h3>No products found</h3>
            <p>Try a different search or add a new product.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  // Build one row per product.
  tableBody.innerHTML = products
    .map((p) => {
      return `
        <tr>
          <td class="product-name">${escapeHtml(p.name)}</td>
          <td class="hide-mobile">${escapeHtml(p.category)}</td>
          <td>Rs.${Number(p.price).toLocaleString()}</td>
          <td>${p.quantity}</td>
          <td>${stockBadge(p.quantity)}</td>
          <td>
            <div class="row-actions">
              <a href="product-form.html?id=${p.id}"
                 class="btn btn-secondary btn-sm">Edit</a>
              <button class="btn btn-danger btn-sm"
                      data-id="${p.id}">Delete</button>
            </div>
          </td>
        </tr>`;
    })
    .join("");

  // Attach click handlers to all the Delete buttons.
  document.querySelectorAll(".btn-danger[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      handleDelete(button.dataset.id, button);
    });
  });
}

// Ask for confirmation, then remove the product.
function handleDelete(id, button) {
  // Find the product name so we can show it in the message.
  const products = getProducts();
  const product = products.find((p) => p.id === id);

  const message =
    'Delete "' + (product ? product.name : "this product") + '"?';

  // confirm() shows a small Yes/No dialog in the browser.
  if (confirm(message)) {
    deleteProduct(id);
    showToast("Product deleted", "success");
    // Refresh the list.
    renderProducts(searchInput.value);
  }
}

// Return a colored badge based on the quantity.
function stockBadge(quantity) {
  if (quantity === 0) {
    return '<span class="badge badge-out-stock">Out of stock</span>';
  }
  if (quantity <= 10) {
    return '<span class="badge badge-low-stock">Low stock</span>';
  }
  return '<span class="badge badge-in-stock">In stock</span>';
}

// Make text safe to show in HTML.
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Show a small pop-up message at the bottom of the screen.
function showToast(message, type = "") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast " + type;
  // Force the browser to notice the change before showing it.
  void toast.offsetWidth;
  toast.classList.add("show");
  // Hide it after 2.5 seconds.
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Re-filter the list every time the user types in the search box.
searchInput.addEventListener("input", () => {
  renderProducts(searchInput.value);
});

// Show all products when the page first loads.
renderProducts();
