// models/User.js
// Represents both Customers and Artisans (Sellers). Role field distinguishes them.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default in queries
    },
    role: {
      type: String,
      enum: ['customer', 'artisan', 'admin'],
      default: 'customer',
    },
    phone: {
      type: String,
      trim: true,
    },
    // Only relevant for artisans/sellers
    shopName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    state: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    isVerifiedArtisan: {
      type: Boolean,
      default: false,
    },
    isApproved: {
  type: Boolean,
  default: false, // artisans need admin approval, customers auto-approved
},
  },
  { timestamps: true }
);

// Hash password before saving (only if it was modified)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
