const Customer = require("../models/Customer");

// GET /api/customers?search=
const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const q = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } }
          ]
        }
      : {};
    const customers = await Customer.find(q).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/customers/phone/:phone
const getCustomerByPhone = async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: String(req.params.phone).trim() });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCustomers, getCustomerByPhone };
