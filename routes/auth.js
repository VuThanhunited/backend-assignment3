const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyUser } = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", verifyUser, authController.getCurrentUser);

module.exports = router;
