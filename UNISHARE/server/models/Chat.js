// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference the Product model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Chat", chatSchema);
