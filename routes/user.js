const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/auth");

router.get("/cart", verifyToken, userController.getCart);
router.put("/cart", verifyToken, userController.updateCart);

module.exports = router;
