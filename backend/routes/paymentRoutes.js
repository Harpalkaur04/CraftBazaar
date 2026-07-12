const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { protect } = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc   Create Razorpay order
// @route  POST /api/payment/create-order
// @access Private
router.post("/create-order", protect, async (req, res, next) => {
  try {
    const { amount } = req.body; // amount in rupees

    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error("Invalid amount");
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay needs paise (1 rupee = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
});

// @desc   Verify payment after success
// @route  POST /api/payment/verify
// @access Private
router.post("/verify", protect, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Compare signatures
    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error("Payment verification failed — invalid signature");
    }

    res.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: "Payment verified successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
