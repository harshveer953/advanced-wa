const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    // keywords help in matching WhatsApp text
    keywords: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
