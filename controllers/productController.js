const Product = require("../models/Product");

// ✅ Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ✅ Lấy chi tiết 1 sản phẩm và sản phẩm liên quan
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Lấy các sản phẩm khác cùng category (trừ sản phẩm hiện tại)
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(4);

    res.json({ product, relatedProducts });
  } catch (err) {
    res.status(500).json({ message: "Error getting product detail" });
  }
};

// ✅ Thêm mới sản phẩm (Admin)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Failed to create product" });
  }
};

// ✅ Cập nhật sản phẩm theo ID (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

// ✅ Xoá sản phẩm theo ID (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
