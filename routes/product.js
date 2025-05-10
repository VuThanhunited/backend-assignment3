const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

const { verifyAdmin } = require("../middleware/authMiddleware");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Admin routes
router.get(
  "/admin/products",
  authenticate,
  authorize(["admin"]),
  productController.getAllProducts
);
router.post("/", verifyAdmin, productController.createProduct);
router.put("/:id", verifyAdmin, productController.updateProduct);
router.delete("/:id", verifyAdmin, productController.deleteProduct);

module.exports = router;
