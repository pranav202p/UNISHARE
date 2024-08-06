import mongoose from 'mongoose';
import crypto from 'crypto';

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
    trim: true // Trim whitespace from Selleremail
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
    default: false
  }
});

// Define a pre-save hook to generate productId based on productName
productSchema.pre('save', function(next) {
  if (this.isNew && this.productName) {
    const hash = crypto.createHash('sha256');
    hash.update(this.productName);
    const generatedProductId = hash.digest('hex');
    this.productId = generatedProductId;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
