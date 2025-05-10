const Session = require("../models/Session");

// ✅ Tạo session chat (một user có thể có nhiều session)
exports.createSession = async (req, res) => {
  try {
    const session = new Session({ user: req.user.id, messages: [] });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to create session" });
  }
};

// ✅ Lấy tất cả các phiên chat của người dùng
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// ✅ Thêm tin nhắn vào phiên chat
exports.addMessageToSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, sender } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.messages.push({ sender, message, timestamp: new Date() });
    await session.save();

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
