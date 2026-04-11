import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: {
        type: String
    },
    productId: {
        type: String
    },
    quantity: {
        type: Number
    },
    totalPrice: {
        type: Number
    }
}, { timestamps: true })
const Order = mongoose.model('Order', orderSchema)
export default Order