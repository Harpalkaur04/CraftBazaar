// models/Review.js
// Represents a customer's rating/review on a product

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    isFlagged: {
  type: Boolean,
  default: false,
},
flaggedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
},
flagReason: {
  type: String,
  trim: true,
},
  },
  { timestamps: true }
);

// Prevent the same customer from reviewing the same product more than once
reviewSchema.index({ product: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
