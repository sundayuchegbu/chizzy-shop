const { default: mongoose } = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  } = req.body;

  if (!name || !category || !brand || !quantity || !price || !description) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // create Product
  const product = await Product.create({
    name,
    sku,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  });

  res.status(201).json(product);
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort('-createdAt');
  res.status(200).json(products);
});

// Get single Product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Product Deleted' });
});
// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  //    Update product
  const updateProduct = await Product.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      name,
      category,
      brand,
      quantity,
      price,
      description,
      image,
      regularPrice,
      color,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json(updateProduct);
});
// Review product
const reviewProduct = asyncHandler(async (req, res) => {
  const { star, review, reviewDate } = req.body;
  const { id } = req.params;

  // Validation
  if (star < 1 || !review) {
    res.status(400);
    throw new Error('Please add a star and review');
  }
  const product = await Product.findById(id);
  if (!product) {
    res.status(400);
    throw new Error('Product not found');
  }
  // Update Rating
  product.ratings.push({
    star,
    review,
    reviewDate,
    name: req.user.name,
    userID: req.user._id,
  });
  product.save();
  res.status(200).json({ message: 'Product review added' });
});

// Delete Review
const deleteReview = asyncHandler(async (req, res) => {
  const { userID } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error('Product not found');
  }

  const newRatings = product.ratings.filter((rating) => {
    return rating.userID.toString() !== userID.toString();
  });
  product.ratings = newRatings;
  product.save();
  res.status(200).json({ message: 'Product Review have been deleted' });
});

// Update Review
const updateReview = asyncHandler(async (req, res) => {
  const { star, review, reviewDate, userID } = req.body;
  const { id } = req.params;

  // Validation
  if (star < 1 || !review) {
    res.status(400);
    throw new Error('Please add a star and review');
  }
  const product = await Product.findById(id);
  if (!product) {
    res.status(400);
    throw new Error('Product not found');
  }
  // match user to review
  if (req.user._id.toString() !== userID) {
    res.status(401);
    throw new Error('User not authorized');
  }
  const updatedReview = await Product.findOneAndUpdate(
    {
      _id: product._id,
      'ratings.userID': mongoose.Types.ObjectId(userID),
    },
    {
      $set: {
        'ratings.$.star': star,
        'ratings.$.review': review,
        'ratings.$.reviewDate': reviewDate,
      },
    }
  );
  if (updatedReview) {
    res.status(200).json({ message: 'Product Review updated' });
  } else {
    res.status(400).json({ message: 'Product Review NOT updated' });
  }
});
module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateReview,
  reviewProduct,
  deleteReview,
  deleteProduct,
};
