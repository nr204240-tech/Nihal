// ============================================================
// product-form.js
// Handles both adding a new product and editing an existing one.
// We know which one to do by looking at "?id=..." in the address.
// ============================================================

import {
  addProduct,
  updateProduct,
  getProductById,
  generateId,
} from "./storage.js";
import { requireLogin, getCurrentUser, logout } from "./auth.js";

// Protect this page.
requireLogin();

// Show username and set up logout.
document.getElementById("user-name").textContent = "Hi, " + getCurrentUser();
document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
  window.location.href = "index.html";
});

// Grab all the form fields.
const form = document.getElementById("product-form");
const errorBox = document.getElementById("form-error");
const titleEl = document.getElementById("form-title");
const subtitleEl = document.getElementById("form-subtitle");
const saveBtn = document.getElementById("save-btn");

// Look at the web address for "?id=123".
// If there is an id, we are EDITING that product.
// If there is no id, we are ADDING a new one.
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

// Keep track of the product we are editing (if any).
let editingProduct = null;

if (editId) {
  // We are editing. Find the product and fill the form.
  editingProduct = getProductById(editId);

  if (editingProduct) {
    titleEl.textContent = "Edit Product";
    subtitleEl.textContent = "Update the details of this product";
    saveBtn.textContent = "Update Product";

    // Put the existing values into the fields.
    document.getElementById("name").value = editingProduct.name;
    document.getElementById("category").value = editingProduct.category;
    document.getElementById("price").value = editingProduct.price;
    document.getElementById("quantity").value = editingProduct.quantity;
    document.getElementById("description").value =
      editingProduct.description || "";
  } else {
    // The id did not match any product.
    errorBox.textContent = "Product not found.";
    errorBox.classList.add("show");
  }
}

// When the form is submitted, save the product.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBox.classList.remove("show");

  // Read the values from the form.
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;
  const description = document.getElementById("description").value.trim();

  // Make sure required fields are not empty.
  if (!name || !category || !price || !quantity) {
    showError("Please fill in all required fields.");
    return;
  }

  // Make sure price and quantity are valid numbers.
  if (Number(price) < 0 || Number(quantity) < 0) {
    showError("Price and quantity cannot be negative.");
    return;
  }

  if (editingProduct) {
    // ----- Update an existing product -----
    // Keep the same id, just change the other details.
    updateProduct({
      id: editingProduct.id,
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      description,
    });
    showToast("Product updated", "success");
  } else {
    // ----- Add a new product -----
    addProduct({
      id: generateId(),
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      description,
    });
    showToast("Product added", "success");
  }

  // Go back to the products list after saving.
  window.location.href = "products.html";
});

// Show an error message on the form.
function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.add("show");
}

// Show a small pop-up message at the bottom of the screen.
function showToast(message, type = "") {
  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  // Force the browser to notice the element before adding the show class.
  void toast.offsetWidth;
  toast.classList.add("show");
  // Remove it after 2.5 seconds.
  setTimeout(() => {
    toast.classList.remove("show");
    toast.remove();
  }, 2500);
}
