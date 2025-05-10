const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/authMiddleware");
const {
  createSession,
  getUserSessions,
  addMessageToSession,
} = require("../controllers/sessionController");

// Tạo session chat mới (nếu cần)
router.post("/", verifyUser, createSession);

// Lấy tất cả session của người dùng
router.get("/", verifyUser, getUserSessions);

// Gửi tin nhắn trong phiên chat
router.post("/:sessionId/message", verifyUser, addMessageToSession);

module.exports = router;
