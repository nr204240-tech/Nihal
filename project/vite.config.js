import { resolve } from "path";
import { defineConfig } from "vite";

// Vite config set up for a multi-page app.
// Each HTML page is listed here so Vite knows to build them all.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        products: resolve(__dirname, "products.html"),
        productForm: resolve(__dirname, "product-form.html"),
      },
    },
  },
});
