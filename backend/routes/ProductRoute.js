const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  reviewProduct,
  deleteReview,
  updateReview,
} = require('../controllers/ProductController');
const router = express.Router();

router.route('/create').post(protect, adminOnly, createProduct);
router.route('/').get(getProducts);
router.route('/:id').get(getProduct);
router.route('/:id').delete(protect, adminOnly, deleteProduct);
router.route('/:id').patch(protect, adminOnly, updateProduct);

router.route('/review/:id').patch(protect, reviewProduct);
router.route('/review/:id').delete(protect, deleteReview);
router.route('/updateReview/:id').patch(protect, updateReview);

module.exports = router;
