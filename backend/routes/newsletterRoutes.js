const express = require('express');
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber,
} = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);
router.get('/', protect, authorize('admin'), getNewsletterSubscribers);
router.delete('/:id', protect, authorize('admin'), deleteNewsletterSubscriber);

module.exports = router;
