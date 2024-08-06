import mongoose from 'mongoose';

const { Schema } = mongoose;

const sellerNotificationSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SellerNotification = mongoose.model('SellerNotification', sellerNotificationSchema);

export default SellerNotification;
