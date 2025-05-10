const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log("🔐 Token received:", token); // Log token để debug

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verify error:", err.message);
    return res.status(403).json({ message: "Token invalid" });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyUser(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Admin access only" });
    }
  });
};

module.exports = { verifyUser, verifyAdmin };
