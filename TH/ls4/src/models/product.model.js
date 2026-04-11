import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    }
}, { timestamps: true })


const Product = mongoose.model('Product', productSchema)
export default Product