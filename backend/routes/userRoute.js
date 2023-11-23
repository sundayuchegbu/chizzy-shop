const express = require('express');
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/user').get(protect, getUser);
router.route('/status').get(getLoginStatus);
router.route('/update').patch(protect, updateUser);
router.route('/photo').patch(protect, updatePhoto);

module.exports = router;
