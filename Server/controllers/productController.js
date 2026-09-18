const Product = require("../models/Product");

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, price, keywords } = req.body;
    if (!name || price === undefined) return res.status(400).json({ message: "name & price required" });

    const cleanKeywords = Array.isArray(keywords)
      ? keywords.map((k) => String(k).toLowerCase().trim()).filter(Boolean)
      : [];

    const product = await Product.create({
      name: String(name).trim(),
      price: Number(price),
      keywords: cleanKeywords
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products?search=
const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const q = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { keywords: { $elemMatch: { $regex: search, $options: "i" } } }
          ]
        }
      : {};

    const products = await Product.find(q).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, price, keywords } = req.body;

    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (price !== undefined) update.price = Number(price);
    if (keywords !== undefined) {
      update.keywords = Array.isArray(keywords)
        ? keywords.map((k) => String(k).toLowerCase().trim()).filter(Boolean)
        : [];
    }

    const p = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
