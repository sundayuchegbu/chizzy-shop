const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { now } = require('mongoose');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill  all the input fields');
  }
  if (password.length < 0) {
    res.status(400);
    throw new Error('Password must be up to 6 characters');
  }
  // check if user exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error('This email have been used');
  }
  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });
  // Generate token
  const token = generateToken(user._id);
  if (user) {
    const { _id, name, email, role } = user;
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // secure:true,
      // sameSite:'none'
    });
    res.status(201).json({
      _id,
      name,
      email,
      role,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please add email and password');
  }
  // check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User does not exist');
  }
  // check for password
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  // Generate token
  const token = generateToken(user._id);
  if (user && passwordIsCorrect) {
    const newUser = await User.findOne({ email }).select('-password');
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // secure:true,
      // samesite:none
    });
    res.status(201).json(newUser);
  } else {
    res.status(400);
    throw new Error('Invalid credential');
  }
});

// logout user
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User successfully logged out' });
});

// Get user
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Get user status
const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    res.json(true);
  }
  res.json(false);
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    const { name, password, phone, address } = user;
    user.name = req.body.name || name;
    user.password = req.body.password || password;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});
//  update photo
const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await User.findById(req.user.id);
  user.photo = photo;
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
  logout,
};
