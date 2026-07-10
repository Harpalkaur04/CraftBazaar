// models/Product.js
// Represents a handmade product listed by an artisan

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String], // array of image URLs
      default: [],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'textiles',
        'jewellery',
        'pottery',
        'home-decor',
        'footwear-leather',
        'paintings',
        'carpets-rugs',
        'toys-puppets',
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    state: {
      type: String, // e.g. 'Rajasthan', 'Gujarat' - origin of the craft
      required: true,
      trim: true,
    },
    craftType: {
      type: String, // e.g. 'Bandhani', 'Blue Pottery', 'Meenakari'
      trim: true,
    },
    craftStory: {
      type: String, // artisan's own note about this specific piece
      maxlength: 1500,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 1,
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isHandmadeVerified: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true, // allows soft-delete / hiding without removing data
    },
  },
  { timestamps: true }
);

// Index for faster filtering/search
productSchema.index({ category: 1, state: 1 });
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
