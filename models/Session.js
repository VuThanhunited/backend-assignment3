const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"] },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
