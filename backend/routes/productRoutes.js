// routes/productRoutes.js
// All product-related API endpoints for craftbazaar

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductStates,
  getProductCategories,
  verifyHandmade,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ─── Public Routes ────────────────────────────────────────────
// GET /api/products              → all products (with filters)
// GET /api/products/states       → list of all states with products
// GET /api/products/categories   → list of all categories
// GET /api/products/:id          → single product detail

router.get('/states', getProductStates);
router.get('/categories', getProductCategories);
router.get('/my-products', protect, authorize('artisan', 'admin'), getMyProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Artisan routes
// GET  /api/products/my-products -> artisan's own listings
// POST /api/products             -> create new product

router.post('/', protect, authorize('artisan', 'admin'), createProduct);

// ─── Artisan/Admin Routes ─────────────────────────────────────
// PUT    /api/products/:id         → update product
// DELETE /api/products/:id         → soft delete product
// PUT    /api/products/:id/verify  → admin verifies handmade badge

router.put('/:id', protect, authorize('artisan', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('artisan', 'admin'), deleteProduct);
router.put('/:id/verify', protect, authorize('admin'), verifyHandmade);

module.exports = router;