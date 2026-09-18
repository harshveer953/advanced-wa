const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrderFromText,
  getOrders,
  getOrder,
  updateOrderStatus
} = require("../controllers/orderController");

router.post("/from-text", protect, createOrderFromText);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;
