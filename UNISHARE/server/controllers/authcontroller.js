import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import user from "../models/userModel.js";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import mongoose from 'mongoose';

import Product from "../models/ProductModel.js";

import nodemailer from 'nodemailer';
//for send mail
const sendVerifyMail=async(firstName,email)=>{
  try{
    const transporter= nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:465,
      secure:true,
     
      
      auth:{
        user:'pranavpravi2002@gmail.com',
        pass:'bcbcuuddfkhopukl'
      }
    })
    const mailOptions={
      from:'pranavpravi2002@gmail.com',
      to:email,
      subject:'For Verififctiom mail',
      html: '<p>Hi ' + firstName + ', Please click here to <a href="http://localhost:3000/login">Verify</a> your mail.</p>'

    }
    transporter.sendMail(mailOptions,function(error,info){
      if(error){
        console.log(error);
      }
      else{
        console.log("Email has been sent:-",info.response)
      }
    })

  }catch(error){
    console.log(error.message)

  }
}
 export const verifyMail=async(req,res)=>{
  try{
    await userModel.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });

    console.log(updatedInfo)
    res.redirect('/login');
  }catch(error){
    console.log(error.message)
  }

}
export const registerController = async (req, res) => {
  try {
    const { firstName, lastName,Phoneno,  email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!firstName || !lastName  ||!Phoneno || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate UserId format (should be a 24-character hexadecimal string)
    

    // Check if user with the same email exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists. Please use a different email.',
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user instance
    const newUser = new userModel({
      firstName,
      lastName,
      Phoneno,
      email,
      password: hashedPassword,
      confirmPassword,
      isActive: true, 
      is_verified:0// Assuming isActive is defaulted to true
    });

    // Save the new user to the database
    await newUser.save();

    sendVerifyMail(req.body.firstName,req.body.email,newUser._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration',
      error: error.message,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate userid and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userid or password',
      });
    }

    // Find user by email
    const foundUser = await userModel.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userid or password',
      });
    }

    // Check if the user account is active
    if (!foundUser.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account is deactivated. Please contact the administrator.',
      });
    }

    // Generate JWT token
    const token = JWT.sign({ _id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return successful login response with user data and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: foundUser._id,
        firstName: foundUser.firstName,
        email: foundUser.email,
        isActive: foundUser.isActive, // Include isActive status in the response
      },
      token,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message,
    });
  }
};
export const testController = (req, res) => {

  res.send("protected route");
};
export const sellController = async (req, res) => {
  // Add your sell logic here...
  try {
    // Extract data from request body
    const { productId, productName,SellerName,SellerID,Selleremail, productDescription, productImage, productPrice, productCategory, productCondition } = req.body;

    // Validate data...
    if (!productId || !productName ||!SellerName||!SellerID||!Selleremail|| !productDescription || !productImage || !productPrice || !productCategory || !productCondition) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Example logic: Save product to database
    const product = await Product.create({ productId, productName, SellerName,SellerID,Selleremail,productDescription, productImage, productPrice, productCategory, productCondition });
    res.status(201).json({ success: true, message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error selling product:', error);
    res.status(500).json({ success: false, message: 'Error selling product', error: error.message });
  }
};
export const getProductController = async (req, res) => {
  try {
    // Fetch products from the database
    const products = await Product.find();

    // Check if products were found
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

    // Return the products in the response
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};
export const getCategoryController = async (req, res) => {
  try {
    // Fetch distinct product categories from the database
    const categories = await Product.distinct("productCategory");

    // Check if categories were found
    if (!categories || categories.length === 0) {
      return res.status(404).json({ success: false, message: 'No categories found' });
    }

    // Return the categories in the response
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
};
export const getRecommendedProductsController = async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch recommended products based on the specified category
    const recommendedProducts = await Product.find({ productCategory: category }).limit(5); // Fetching 5 recommended products

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
};
export const notifySellerController = async (req, res) => {
  try {
    // Extract the productId and message from the request body
    const { productId, message } = req.body;

    
    const product = await Product.findById(productId).maxTimeMS(30000); // Increase timeout to 30 seconds


    // Check if the product exists
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Retrieve seller information from the product
    const { SellerID, Selleremail, SellerName } = product;
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user:'pranavpravi2002@gmail.com',
        pass:'bcbcuuddfkhopukl'
      }
    });

    // Compose the email message
    const mailOptions = {
      from: 'pranavpravi2002@gmail.com', // Sender's email address
      to: Selleremail, // Receiver's email address (seller's email)
      subject: 'Product Notification', // Email subject
      text: `Hello ${SellerName},\n\nYour product with ID ${productId} has been notified.\nMessage from user: ${message}`, // Email body
    };

    /// Send the email notification
    const info = await transporter.sendMail(mailOptions);

    // Log the email sending info for debugging (optional)
    console.log('Email sent:', info);
    // Return a success response
    return res.status(200).json({ success: true, message: 'Notification sent to the seller' });
  } catch (error) {
    console.error('Error notifying seller:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




// View all shared resources
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

// Search, filter, and sort resources
export const searchFilterSortProducts = async (req, res) => {
  try {
    const { category, sortBy, sortOrder } = req.query;

    let query = {};
    if (category) {
      query.productCategory = category;
    }

    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .exec();

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error filtering and sorting products:", error);
    res.status(500).json({ success: false, message: "Error filtering and sorting products", error: error.message });
  }
};

// Approve or reject resource upload
export const approveRejectProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { isApproved } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { isApproved },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error approving/rejecting product:", error);
    res.status(500).json({ success: false, message: "Error approving/rejecting product", error: error.message });
  }
};

// Edit resource
export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, productDescription, productCategory } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productName, productDescription, productCategory },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ success: false, message: "Error editing product", error: error.message });
  }
};

// Delete resource
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product", error: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { oldPassword, newPassword, newPasswordConfirm } = req.body;
    const profilePic = '/images/user1.png'; // Assuming profilePic is uploaded as a file

    // Validate password change
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Check if the user is authenticated (req.user should be set by authentication middleware)
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { _id } = req.user;

    // Fetch the user from the database based on _id
    const user = await userModel.findById(_id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the old password matches the current password
    if (oldPassword && !user.authenticate(oldPassword)) {
      return res.status(401).json({ error: 'Incorrect old password' });
    }

    // Update user data
    if (newPassword) {
      user.password = newPassword;
    }
    if (profilePic) {
      user.profilePic = profilePic.path; // Assuming profilePic.path contains the file path
    }

    // Save the updated user data
    await user.save();

    // Respond with updated user details (firstName, lastName, email)
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic:user,profilePic
       
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
