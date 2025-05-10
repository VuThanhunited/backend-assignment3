const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/authMiddleware");
const auth = require("../middleware/auth");
const {
  createOrder,
  getUserOrders,
  getOrderById,
} = require("../controllers/orderController");

router.post("/", verifyUser, auth, createOrder);
router.get("/user", verifyUser, getUserOrders);
router.get("/:id", verifyUser, getOrderById);

module.exports = router;
