// controllers/reviewController.js
// Handles product reviews and ratings for craftbazaar

const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Add a review to a product
// @route   POST /api/reviews/:productId
// @access  Private (customer)
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating) {
      res.status(400);
      throw new Error('Rating is required');
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if this customer already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: productId,
      customer: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    const review = await Review.create({
      product: productId,
      customer: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Recalculate average rating on the Product document
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    product.averageRating = Math.round(avgRating * 10) / 10; // round to 1 decimal
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review (only the reviewer)
// @route   PUT /api/reviews/:reviewId
// @access  Private (customer who wrote it)
const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this review');
    }

    review.rating = rating !== undefined ? Number(rating) : review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Recalculate average rating
    const allReviews = await Review.find({ product: review.product });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(review.product, {
      averageRating: Math.round(avgRating * 10) / 10,
      numReviews: allReviews.length,
    });

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (reviewer or admin)
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (
      review.customer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();

    // Recalculate average rating after deletion
    const allReviews = await Review.find({ product: review.product });
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
        : 0;

    await Product.findByIdAndUpdate(review.product, {
      averageRating: Math.round(avgRating * 10) / 10,
      numReviews: allReviews.length,
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
};