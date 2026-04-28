import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
