const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.post("/", protect, createProduct);
router.patch("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
