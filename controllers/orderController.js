const Order = require("../models/Order");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");

exports.createOrder = async (req, res) => {
  try {
    const { cartItems, fullName, phone, address, email } = req.body;

    if (!cartItems?.length || !fullName || !phone || !address || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,11}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    let total = 0;

    const products = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        const lineTotal = product.price * item.quantity;
        total += lineTotal;

        return {
          product: product._id,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          img: product.img1,
        };
      })
    );

    const order = new Order({
      user: req.user.id,
      products: products.map((p) => ({
        product: p.product,
        quantity: p.quantity,
      })),
      fullName,
      phone,
      address,
      email,
      total,
    });

    const saved = await order.save();

    await sendOrderEmail(
      {
        fullName,
        phone,
        address,
        email,
        total,
        products,
      },
      email
    );

    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Order error:", error);
    res
      .status(500)
      .json({ message: "Error placing order", error: error.message });
  }
};

const sendOrderEmail = async (order) => {
  const { fullName, phone, address, total, products, email } = order;

  const formatter = new Intl.NumberFormat("vi-VN");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const productList = products
    .map(
      (p) => `
        <tr>
          <td>${p.name}</td>
          <td><img src="${p.img}" alt="${p.name}" width="50" /></td>
          <td>${formatter.format(p.price)} VND</td>
          <td>${p.quantity}</td>
          <td>${formatter.format(p.price * p.quantity)} VND</td>
        </tr>
      `
    )
    .join("");

  const htmlContent = `
    <h2>Xin chào ${fullName},</h2>
    <p>Đơn hàng của bạn đã được xác nhận vào lúc <strong>${new Date().toLocaleString(
      "vi-VN"
    )}</strong>.</p>
    <p><strong>Địa chỉ:</strong> ${address}</p>
    <p><strong>Số điện thoại:</strong> ${phone}</p>

    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Hình ảnh</th>
          <th>Đơn giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        ${productList}
      </tbody>
    </table>

    <h3 style="margin-top: 20px">Tổng thanh toán: ${formatter.format(
      total
    )} VND</h3>
    <p>Cảm ơn bạn đã mua sắm cùng chúng tôi!</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác nhận đơn hàng của bạn",
      html: htmlContent,
    });
    console.log("📧 Email xác nhận đã được gửi tới:", email);
  } catch (err) {
    console.error("📨 Gửi email thất bại:", err);
    throw err;
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId; // fallback nếu không có middleware

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const orders = await Order.find({ user: userId }).populate(
      "products.product"
    );

    res.json(orders);
  } catch (error) {
    console.error("❌ getUserOrders error:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
