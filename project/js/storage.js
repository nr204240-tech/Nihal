// ============================================================
// storage.js
// Small helper functions for saving and reading data from
// the browser's Local Storage. Local Storage keeps data even
// after the page is refreshed or the browser is closed.
// ============================================================

// The "key" is the name we use to store our products list.
const PRODUCTS_KEY = "ims_products";

// Read all products from Local Storage.
// If nothing is saved yet, return an empty array.
function getProducts() {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    // If the saved data is broken, start fresh.
    console.error("Could not read products:", error);
    return [];
  }
}

// Save the whole products array back into Local Storage.
function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Add one new product to the list and save it.
function addProduct(product) {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

// Update a product that already exists (matched by id).
function updateProduct(updatedProduct) {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    saveProducts(products);
  }
}

// Delete a product by its id.
function deleteProduct(id) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

// Find a single product by its id. Returns undefined if not found.
function getProductById(id) {
  return getProducts().find((p) => p.id === id);
}

// Create a simple unique id using the current time + a random number.
function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}

// Export the functions so other files can use them.
export {
  getProducts,
  saveProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  generateId,
};
