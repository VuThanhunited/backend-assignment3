const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "consultant", "admin"],
    default: "customer",
  },
});

module.exports = mongoose.model("User", userSchema);
