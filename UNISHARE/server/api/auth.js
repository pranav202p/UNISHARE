import express from 'express';
import multer from 'multer';
import {
  registerController,
  loginController,
  updateUserProfile,
  notifySellerController,
  sellController,
  getProductController,
  getCategoryController,
  verifyMail
} from '../controllers/authcontroller.js';
import { requireSignIn } from '../middlewares/authmiddleware.js';
import Product from '../models/ProductModel.js';
import userModel from '../models/userModel.js';
import Wishlist from '../models/Wishlist.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/sell', sellController);
router.post('/send-verification-email', registerController, verifyMail);

router.post('/upload-image', upload.single('productImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ imageUrl: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products', getProductController);
router.get('/categories', getCategoryController);
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

router.get('/user/profile', upload.single('profilePic'), requireSignIn, updateUserProfile);
router.post('/profile', requireSignIn, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (oldPassword && !user.authenticate(oldPassword)) {
      return res.status(401).json({ error: 'Incorrect old password' });
    }
    if (newPassword) {
      user.password = newPassword;
    }
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
