require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Đăng ký tài khoản
exports.register = async (req, res) => {
  const { email, password, fullName, phone } = req.body;

  try {
    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      phone,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Email or password incorrect" });

    if (!user.password)
      return res
        .status(500)
        .json({ success: false, message: "Invalid user data" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Email or password incorrect" });

    if (!JWT_SECRET) {
      console.error(
        "JWT_SECRET is undefined. Check your .env file and restart the server."
      );
      return res
        .status(500)
        .json({ message: "Server config error: Missing JWT_SECRET" });
    }
    // ✅ Tạo JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Gửi token dưới dạng cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true nếu dùng HTTPS
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    // ✅ Gửi thông tin user (không cần gửi token)
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};
