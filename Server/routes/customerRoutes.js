const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { getCustomers, getCustomerByPhone } = require("../controllers/customerController");

router.get("/", protect, getCustomers);
router.get("/phone/:phone", protect, getCustomerByPhone);

module.exports = router;
