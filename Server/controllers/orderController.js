const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const { parseWhatsAppOrder, normalize } = require("../utils/parseWhatsAppOrder");

// helper: match product by keywords/text
const matchProduct = async (itemName) => {
  const n = normalize(itemName);
  if (!n) return null;

  const tokens = n.split(" ").filter(Boolean);
  const candidates = Array.from(new Set([n, ...tokens])); // try full + tokens

  // find product where keywords contains any token OR name matches
  const product = await Product.findOne({
    $or: [
      { keywords: { $in: candidates } },
      { name: { $regex: n, $options: "i" } }
    ]
  });

  return product || null;
};

// POST /api/orders/from-text
// body: { phone, name, text }
const createOrderFromText = async (req, res) => {
  try {
    const { phone, name, text } = req.body;
    if (!phone || !text) return res.status(400).json({ message: "phone & text required" });

    // find or create customer
    const cleanPhone = String(phone).trim();
    let customer = await Customer.findOne({ phone: cleanPhone });

    if (!customer) {
      customer = await Customer.create({
        phone: cleanPhone,
        name: name ? String(name).trim() : "Customer"
      });
    } else if (name && !customer.name) {
      customer.name = String(name).trim();
      await customer.save();
    }

    // parse items from whatsapp text
    const parsedItems = parseWhatsAppOrder(text);
    if (!parsedItems.length) return res.status(400).json({ message: "No items detected from text" });

    // build order items with matching
    const items = [];
    for (const it of parsedItems) {
      const product = await matchProduct(it.name);

      if (product) {
        items.push({
          productId: product._id,
          nameSnapshot: product.name,
          priceSnapshot: product.price,
          qty: it.qty
        });
      } else {
        // unmatched item - still keep it
        items.push({
          productId: null,
          nameSnapshot: it.name,
          priceSnapshot: 0,
          qty: it.qty
        });
      }
    }

    const totalAmount = items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);

    const order = await Order.create({
      customerId: customer._id,
      items,
      totalAmount,
      status: "PENDING",
      note: String(text)
    });

    const populated = await Order.findById(order._id).populate("customerId");

    res.status(201).json({
      message: "Order created ✅",
      order: populated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders?status=PENDING
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const q = status ? { status } : {};
    const orders = await Order.find(q)
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customerId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/orders/:id/status
// body: { status }
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("customerId");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Status updated ✅", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrderFromText, getOrders, getOrder, updateOrderStatus };
