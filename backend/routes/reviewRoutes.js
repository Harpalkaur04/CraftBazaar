const express = require('express');
const router  = express.Router();
const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');
const Review = require('../models/Review');


// GET all reviews on artisan's own products
router.get('/artisan', protect, authorize('artisan'), async (req, res, next) => {
  try {
    const Product = require('../models/Product');

    // Get artisan's products
    const products = await Product.find({ artisan: req.user._id })
      .select('_id title images');

    const productIds = products.map(p => p._id);

    // Get reviews for those products
    const reviews = await Review.find({
      product: { $in: productIds }
    })
      .populate('customer', 'name profileImage')
      .populate('product', 'title images')
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (err) {
    next(err);
  }
});
// ── SPECIFIC routes FIRST before any /:param routes ──────────

// GET /api/reviews/flagged
router.get('/flagged', protect, authorize('admin'), async (req, res, next) => {
  try {
    const reviews = await Review.find({ isFlagged: true })
      .populate('customer', 'name email')
      .populate('product', 'title images')
      .populate('flaggedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { next(err); }
});

// ── productId routes ──────────────────────────────────────────
router.get('/:productId', getProductReviews);
router.post('/:productId', protect, authorize('customer'), addReview);

// ── reviewId routes ───────────────────────────────────────────
// PUT flag MUST come before generic PUT /:reviewId
router.put('/:reviewId/flag', protect, async (req, res, next) => {
  try {
    const { reason } = req.body;
    const review = await Review.findById(req.params.reviewId);
    if (!review) { res.status(404); throw new Error('Review not found'); }
    if (review.customer.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot flag your own review');
    }
    review.isFlagged  = true;
    review.flaggedBy  = req.user._id;
    review.flagReason = reason || 'Inappropriate content';
    await review.save();
    res.json({ message: 'Review reported successfully' });
  } catch (err) { next(err); }
});

// PUT unflag MUST come before generic PUT /:reviewId
router.put('/:reviewId/unflag', protect, authorize('admin'), async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) { res.status(404); throw new Error('Review not found'); }
    review.isFlagged  = false;
    review.flaggedBy  = null;
    review.flagReason = '';
    await review.save();
    res.json({ message: 'Flag dismissed' });
  } catch (err) { next(err); }
});

// Generic update and delete LAST
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;