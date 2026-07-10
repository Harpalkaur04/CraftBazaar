// routes/userRoutes.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc   Approve an artisan
// @route  PUT /api/users/:id/approve
// @access Private (admin only)
router.put('/:id/approve', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    user.isApproved = true;
    await user.save();
    res.json({ message: 'Artisan approved successfully', user });
  } catch (err) {
    next(err);
  }
});

// @desc   Reject (delete) an artisan
// @route  DELETE /api/users/:id/reject
// @access Private (admin only)
router.delete('/:id/reject', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    await user.deleteOne();
    res.json({ message: 'Artisan rejected and removed' });
  } catch (err) {
    next(err);
  }
});

// @desc   Get all artisans (pending or approved)
// @route  GET /api/users/artisans
// @access Private (admin only)
router.get('/artisans', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { role: 'artisan' };
    if (status === 'pending')  filter.isApproved = false;
    if (status === 'approved') filter.isApproved = true;

    const artisans = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    // For each artisan get their product count + avg rating
    const Product = require('../models/Product');
    const artisansWithStats = await Promise.all(
      artisans.map(async (a) => {
        const products = await Product.find({ artisan: a._id, isActive: true });
        const numProducts = products.length;
        const avgRating = numProducts > 0
          ? (products.reduce((s, p) => s + (p.averageRating || 0), 0) / numProducts).toFixed(1)
          : null;
        return {
          ...a.toObject(),
          numProducts,
          averageRating: avgRating,
        };
      })
    );

    res.json(artisansWithStats);
  } catch (err) {
    next(err);
  }
});



module.exports = router;