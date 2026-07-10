// controllers/productController.js
// Handles all product-related operations for craftbazaar

const Product = require('../models/Product');

// @desc    Get all products with filtering, searching and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,    // search by title/description
      category,   // filter by category
      state,      // filter by state of origin
      craftType,  // filter by craft type
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object dynamically based on query params
    const filter = { isActive: true };

    // Text search (uses the text index on title + description)
    if (keyword) {
      filter.$text = { $search: keyword };
    }

    if (category) filter.category = category;
    if (state) filter.state = new RegExp(state, 'i'); // case-insensitive
    if (craftType) filter.craftType = new RegExp(craftType, 'i');

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate('artisan', 'name shopName state profileImage') // bring in artisan info
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'artisan',
      'name shopName state profileImage bio isVerifiedArtisan'
    );

    if (!product || !product.isActive) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product (artisan only)
// @route   POST /api/products
// @access  Private (artisan, admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      images,
      category,
      subcategory,
      state,
      craftType,
      craftStory,
      stock,
    } = req.body;

    if (!title || !description || !price || !category || !state) {
      res.status(400);
      throw new Error('Title, description, price, category and state are required');
    }

    // Check if artisan is approved by admin
if (req.user.role === 'artisan' && !req.user.isApproved) {
  res.status(403);
  throw new Error('Your artisan account is pending admin approval. You cannot add products yet.');
}

    const product = await Product.create({
      title,
      description,
      price,
      images: images || [],
      category,
      subcategory,
      state,
      craftType,
      craftStory,
      stock: stock || 1,
      artisan: req.user._id, // logged-in artisan's id
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (only the artisan who created it, or admin)
// @route   PUT /api/products/:id
// @access  Private (artisan, admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Only the artisan who owns this product (or admin) can update it
    if (
      product.artisan.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }

    const {
      title,
      description,
      price,
      images,
      category,
      subcategory,
      state,
      craftType,
      craftStory,
      stock,
    } = req.body;

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.images = images || product.images;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.state = state || product.state;
    product.craftType = craftType || product.craftType;
    product.craftStory = craftStory || product.craftStory;
    product.stock = stock !== undefined ? stock : product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product - soft delete (only owner or admin)
// @route   DELETE /api/products/:id
// @access  Private (artisan, admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Only the artisan who owns it or admin can delete
    if (
      product.artisan.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    // Soft delete - keeps data in DB but hides from public
    product.isActive = false;
    await product.save();

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products listed by the logged-in artisan
// @route   GET /api/products/my-products
// @access  Private (artisan)
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      artisan: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique states available in products
// @route   GET /api/products/states
// @access  Public
const getProductStates = async (req, res, next) => {
  try {
    const states = await Product.distinct('state', { isActive: true });
    res.json(states.sort());
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories available in products
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories.sort());
  } catch (error) {
    next(error);
  }
};

// @desc    Verify handmade badge (admin only)
// @route   PUT /api/products/:id/verify
// @access  Private (admin)
const verifyHandmade = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.isHandmadeVerified = true;
    await product.save();

    res.json({ message: 'Product marked as Verified Handmade', product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductStates,
  getProductCategories,
  verifyHandmade,
};