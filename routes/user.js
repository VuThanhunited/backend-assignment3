const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/cart", auth, userController.getCart);
router.put("/cart", auth, userController.updateCart);

module.exports = router;
