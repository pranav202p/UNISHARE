import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    profilePic: {
        type: String, // Assuming storing the path or URL to the image
        default: '/images/user1.png' // Optional default profile picture
    },
    confirmPassword: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true // Set isActive to true by default
      },
    is_verified: {
        type: Boolean,
        default: false // Set isActive to true by default
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("users", userSchema); // Use singular model name "User"
