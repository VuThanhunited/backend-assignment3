const User = require("../models/User");

// Lấy giỏ hàng
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Cập nhật giỏ hàng
exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index > -1) {
      user.cart[index].quantity = quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
