const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Phải xác thực trước khi phân quyền
router.use(authenticate);

router.get(
  "/client",
  authorize(["customer", "consultant", "admin"]),
  (req, res) => {
    res.send("Client Page");
  }
);

router.get(
  "/admin/livechat",
  authorize(["consultant", "admin"]),
  (req, res) => {
    res.send("Livechat for Consultants and Admins");
  }
);

router.get("/admin/dashboard", authorize(["admin"]), (req, res) => {
  res.send("Admin Dashboard");
});

module.exports = router;
