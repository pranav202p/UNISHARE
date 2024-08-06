import express from 'express';
import multer from 'multer';
import { registerController, loginController, updateUserProfile,notifySellerController, testController, sellController,getAllProducts,searchFilterSortProducts,approveRejectProduct,editProduct,deleteProduct, getRecommendedProductsController,getProductController,getCategoryController, verifyMail } from '../controllers/authcontroller.js';
import { requireSignIn } from '../middlewares/authmiddleware.js';
import Product from '../models/ProductModel.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';
import crypto from 'crypto'
import Wishlist from '../models/Wishlist.js';


const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Specify the directory where uploaded files will be stored

// Registration
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// Selling a product
router.post('/sell', sellController);
// verifiction mail
router.post('/send-verification-email', registerController,verifyMail);

// Image upload route
router.post('/upload-image', upload.single('productImage'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // The file is uploaded successfully, send the image URL back to the client
      const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
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
router.get('/recommended', async (req, res) => {
  try {
    const { category } = req.query;

    // Check if category is undefined or not provided
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category parameter is required' });
    }

    // Fetch recommended products based on the specified category
    const recommendedProducts = await Product.find({ productCategory: category }).limit(5);

    // Check if recommended products were found
    if (!recommendedProducts || recommendedProducts.length === 0) {
      return res.status(404).json({ success: false, message: 'No recommended products found for this category' });
    }

    // Return the recommended products in the response
    res.status(200).json({ success: true, recommendedProducts });
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({ success: false, message: 'Error fetching recommended products', error: error.message });
  }
});

// Route for fetching product categories
router.get('/categories', getCategoryController);

// Route to fetch product details based on product ID
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
  
// Route to generate productId based on productName
router.post('/generate-product-id', async (req, res) => {
  try {
    // Extract productName from the request body
    const { productName } = req.body;

    // Generate a stable product ID using a hash function (e.g., SHA-256)
    const hash = crypto.createHash('sha256');
    hash.update(productName); // Update the hash with the productName
    const productId = hash.digest('hex'); // Get the hashed value as hexadecimal

    // Send the generated productId back as a response
    res.status(200).json({ productId });
  } catch (error) {
    console.error('Error generating productId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/notify-seller', notifySellerController);


router.post('/generate-seller-id', async (req, res) => {
  try {
    // Extract SellerName from the request body
    const { SellerName } = req.body;

    // Generate a stable seller ID using a hash function (e.g., SHA-256)
    const hash = crypto.createHash('sha256');
    hash.update(SellerName); // Update the hash with the SellerName
    const SellerID = hash.digest('hex'); // Get the hashed value as hexadecimal

    // Send the generated SellerID back as a response
    res.status(200).json({ SellerID });
  } catch (error) {
    console.error('Error generating SellerID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/users/:userId', async (req, res) => {
  try {
    const {_id } = req.params;
    const { isActive } = req.body;

    console.log('Received request to update user with ID:',_id);
    console.log('New isActive value:', isActive);

    // Update user in the database based on_id
    const updatedUser = await userModel.findByIdAndUpdate(
     _id,
      { isActive },
      { new: true }
    );

    if (!updatedUser) {
      console.log('User not found for ID:',_id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User updated successfully:', updatedUser);

    // Respond with the updated user object
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to get all products
router.get("/products", getAllProducts);

// Route to search, filter, and sort products
router.get("/products/search", searchFilterSortProducts);

// Route to approve or reject product upload
router.put("/products/:productId/approve-reject", approveRejectProduct);

// Route to edit product
router.put("/products/:productId/edit", editProduct);

// Route to delete product
router.delete("/products/:productId/delete", deleteProduct);

router.get('/analytics/user', async (req, res) => {
  try {
    // Fetch user analytics data
    const totalUsers = await userModel.countDocuments();
    const activeUsers = await userModel.countDocuments({ isActive: true });

    // Fetch number of products and count based on unique productId
    const productsCountByProductId = await Product.aggregate([
      {
        $group: {
          _id: '$productId', // Group by productId
          totalCount: { $sum: 1 }, // Count number of products per productId
        },
      },
      {
        $sort: { totalCount: -1 }, // Sort by totalCount in descending order (optional)
      },
    ]);

    // You can fetch more analytics data as needed

    res.status(200).json({
      totalUsers,
      activeUsers,
    productsCountByProductId,
      // Add more analytics data properties here
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/analytics/products', async (req, res) => {
  try {
    // Example: Fetch product analytics data (e.g., total count of products) from the database
    const totalCount = await Product.countDocuments();

    // You can fetch more product analytics data as needed from your database

    res.status(200).json({
      totalCount,
      // Add more product analytics data properties here
    });
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/recommendproducts', async (req, res) => {
  const { category, limit = 4 } = req.query; // Default limit to 4 if not specified

  try {
    // Find recommended products based on category name (case-insensitive)
    const recommendedProducts = await Product.find({
      productCategory: { $regex: new RegExp(category, 'i') }, // Match category name case-insensitively
    })
      .limit(parseInt(limit, 10)) // Parse limit parameter to integer
      .exec();

    res.json({ products: recommendedProducts });
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/protectedRoute', requireSignIn, (req, res) => {
  // Access user information from req.user
  const_id = req.user.userId;
  res.json({ message: 'Protected route accessed successfully',_id });
});

router.get('/user/profile', upload.single('profilePic'), requireSignIn, updateUserProfile);
router.post('/profile', requireSignIn ,async (req, res) => {
  try {
    const { oldPassword, newPassword, newPasswordConfirm, } = req.body;

    // Ensure req.user is defined and contains user ID
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { _id } = req.user;
    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password if provided and valid
    if (oldPassword && !user.authenticate(oldPassword)) {
      return res.status(401).json({ error: 'Incorrect old password' });
    }

    if (newPassword) {
      user.password = newPassword;
      user.confirmPassword=newPassword
    }

 

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/user-products',requireSignIn, async (req, res) => {
  try {
    const { email } = req.user; // Assuming authenticated user ID is available in req.user
    const userProducts = await Product.find({ Selleremail: email });
    console.log(userProducts)
    res.status(200).json({ products: userProducts });
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/mark-as-sold/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
 console.log('Received productId:', productId);
    // Check if the productId is a valid ObjectId
    

    // Convert the productId string to ObjectId
  

    // Find and update the product with the specified ObjectId
    const updatedProduct = await Product.findOneAndUpdate(
      { productId }, // Find by productId (assuming productId is unique)
      { isSold: true },
      { new: true } // Return updated product after update
    );
    // Check if the product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return a success response with the updated product
    res.status(200).json({ message: 'Product marked as sold', product: updatedProduct });
  } catch (error) {
    console.error('Error marking product as sold:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/user/wishlist', requireSignIn, async (req, res) => {
  try {
    const { productId, productName, productDescription, productPrice, SellerName, productCondition } = req.body;
    const { _id } = req.user; // Assuming_id is available in req.user after authentication

    // Find or create the user's wishlist
    let wishlist = await Wishlist.findOne({ user:_id});
    console.log(wishlist)

    if (!wishlist) {
      wishlist = new Wishlist({ user:_id, products: [] });
    }

    wishlist.products.push(productId);
    // Add the product to the wishlist
    
    // Save the updated wishlist
    await wishlist.save();

    res.status(201).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/wishlist',requireSignIn, async (req, res) => {
  try {
    // Assuming you have the authenticated user's ID available in req.user._id
    const { _id } = req.user;

    // Fetch the user's wishlist based on their ID
    const wishlist = await Wishlist.findOne({ user: _id }).populate('products');

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/wishlist/:productId', requireSignIn, async (req, res) => {
  const { _id } = req.user;
  const productId = req.params.productId;

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid productId format' });
  }

  try {
    // Convert productId to ObjectId using mongoose.Types.ObjectId
    const productObjectId = mongoose.Types.ObjectId(productId);

    // Find the user and update the wishlist by removing the product ObjectId
    const user = await userModel.findById({user:_id});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the product ObjectId from the user's wishlist array
    user.products = user.products.filter((product) => !product.equals(productObjectId));

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: 'Product removed from wishlist successfully',
      wishlist: user.products
    });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
