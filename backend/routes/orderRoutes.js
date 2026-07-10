// routes/orderRoutes.js
// All order-related API endpoints for craftbazaar

const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getArtisanOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All order routes are protected (must be logged in)

// POST /api/orders                    → place a new order (customer)
// GET  /api/orders/my-orders          → customer's own orders
// GET  /api/orders/artisan-orders     → orders for artisan's products
// GET  /api/orders                    → all orders (admin only)
// GET  /api/orders/:id                → single order detail
// PUT  /api/orders/:id/status         → update order status (artisan/admin)

router.post('/', protect, authorize('customer', 'admin'), placeOrder);
router.get('/my-orders', protect, authorize('customer', 'admin'), getMyOrders);
router.get('/artisan-orders', protect, authorize('artisan', 'admin'), getArtisanOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('artisan', 'admin'), updateOrderStatus);

module.exports = router;