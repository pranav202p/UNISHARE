import mongoose from "mongoose";
import Product from "./ProductModel.js"; // Import the Product model
const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    SellerName: {
      type: String,
      required: true
    },
    SellerID: {
      type: String,
      required: true
    },
    Selleremail: {
      type: String,
      required: true,
    
      trim: true
    },
   
    productDescription: {
      type: String,
      required: true
    },
    productImage: {
      type: String,
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    },
    productCategory: {
      type: String,
      required: true
    },
    productCondition: {
      type: String,
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isSold: {
      type: Boolean,
      default: false // Default to false, indicating product is not sold
    }
  });
const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Array of product references
});

export default mongoose.model('Wishlist', WishlistSchema);
