const NewsletterSubscriber = require("../models/NewsletterSubscriber");

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const subscribeNewsletter = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { email },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({
      message: "You are subscribed to the Craft Bazaar newsletter.",
      subscriber,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "You are already subscribed." });
    }
    next(error);
  }
};

const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const subscriber = await NewsletterSubscriber.findOneAndDelete({ email });

    if (!subscriber) {
      return res.status(404).json({
        message: "This email is not subscribed to the newsletter.",
      });
    }

    res.status(200).json({
      message: "You have been removed from the newsletter list.",
    });
  } catch (error) {
    next(error);
  }
};
const getNewsletterSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find({}).sort({
      createdAt: -1,
    });
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
};

const deleteNewsletterSubscriber = async (req, res, next) => {
  try {
    const subscriber = await NewsletterSubscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    await subscriber.deleteOne();
    res.json({ message: "Subscriber removed from newsletter list" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
};
