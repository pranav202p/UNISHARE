import express from 'express';
import multer from 'multer';
import path from 'path'; // Import the path module
import {
  registerController,
  loginController,
  updateUserProfile,
  notifySellerController,
  testController,
  sellController,
  getAllProducts,
  searchFilterSortProducts,
  approveRejectProduct,
  editProduct,
  deleteProduct,
  getRecommendedProductsController,
  getProductController,
  getCategoryController,
  verifyMail,
} from '../controllers/authcontroller.js';
import { requireSignIn } from '../middlewares/authmiddleware.js';
import Product from '../models/ProductModel.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

// Multer configuration for handling file uploads
const uploadDir = 'uploads/';
const upload = multer({ dest: uploadDir }); // Specify the directory where uploaded files will be stored

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

// Registration
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// Selling a product
router.post('/sell', sellController);

// Verification mail
router.post('/send-verification-email', registerController, verifyMail);

// Image upload route
router.post('/upload-image', upload.single('productImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // The file is uploaded successfully, send the relative image URL back to the client
    const imageUrl = `/${uploadDir}${req.file.filename}`; // Relative path to the image
    res.status(200).json({ imageUrl: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetching products
router.get('/products', getProductController);

// Testing route (requires sign-in)
router.get('/test', requireSignIn, testController);

// Fetching recommended products
router.get('/recommended', async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category parameter is required' });
    }

    const recommendedProducts = await Product.find({ productCategory: category }).limit(5);

    if (!recommendedProducts || recommendedProducts.length === 0) {
      return res.status(404).json({ success: false, message: 'No recommended products found for this category' });
    }

    res.status(200).json({ success: true, recommendedProducts });
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({ success: false, message: 'Error fetching recommended products', error: error.message });
  }
});

// Fetch product categories
router.get('/categories', getCategoryController);

// Fetch product details based on product ID
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Received productId:', productId);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, message: 'Error fetching product details', error: error.message });
  }
});

// Generate productId based on productName
router.post('/generate-product-id', async (req, res) => {
  try {
    const { productName } = req.body;
    const hash = crypto.createHash('sha256');
    hash.update(productName);
    const productId = hash.digest('hex');

    res.status(200).json({ productId });
  } catch (error) {
    console.error('Error generating productId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/notify-seller', notifySellerController);

// Generate SellerID based on SellerName
router.post('/generate-seller-id', async (req, res) => {
  try {
    const { SellerName } = req.body;
    const hash = crypto.createHash('sha256');
    hash.update(SellerName);
    const SellerID = hash.digest('hex');

    res.status(200).json({ SellerID });
  } catch (error) {
    console.error('Error generating SellerID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    console.log('Received request to update user with ID:', userId);
    console.log('New isActive value:', isActive);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );

    if (!updatedUser) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all products
router.get('/products', getAllProducts);

// Search, filter, and sort products
router.get('/products/search', searchFilterSortProducts);

// Approve or reject product upload
router.put('/products/:productId/approve-reject', approveRejectProduct);

// Edit product
router.put('/products/:productId/edit', editProduct);

// Delete product
router.delete('/products/:productId/delete', deleteProduct);

// User analytics
router.get('/analytics/user', async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const activeUsers = await userModel.countDocuments({ isActive: true });

    const productsCountByProductId = await Product.aggregate([
      {
        $group: {
          _id: '$productId',
          totalCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalCount: -1 },
      },
    ]);

    res.status(200).json({
      totalUsers,
      activeUsers,
      productsCountByProductId,
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Product analytics
router.get('/analytics/products', async (req, res) => {
  try {
    const totalCount = await Product.countDocuments();

    res.status(200).json({
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch recommended products based on category
router.get('/recommendproducts', async (req, res) => {
  const { category, limit = 4 } = req.query;

  try {
    const recommendedProducts = await Product.find({
      productCategory: { $regex: new RegExp(category, 'i') },
    })
      .limit(parseInt(limit, 10))
      .exec();

    res.json({ products: recommendedProducts });
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route
router.post('/protectedRoute', requireSignIn, (req, res) => {
  const _id = req.user.userId;
  res.json({ message: 'Protected route accessed successfully', _id });
});

// Update user profile with image upload
router.get('/user/profile', upload.single('profilePic'), requireSignIn, updateUserProfile);

// Update user profile with password change
router.post('/profile', requireSignIn, async (req, res) => {
  try {
    const { oldPassword, newPassword, newPasswordConfirm } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { _id } = req.user;
    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ error: 'New password confirmation does not match' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from the old password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Wishlist route
router.post('/wishlist', requireSignIn, async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'UserId and ProductId are required' });
    }

    const wishlistItem = new Wishlist({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    await wishlistItem.save();
    res.status(201).json({ success: true, wishlistItem });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, message: 'Error adding to wishlist', error: error.message });
  }
});

router.delete('/wishlist/:userId/:productId', requireSignIn, async (req, res) => {
  const { productId, userId } = req.params;

  try {
    const deletedItem = await Wishlist.findOneAndDelete({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
    }

    res.status(200).json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({ success: false, message: 'Error removing item from wishlist', error: error.message });
  }
});

export default router;
``