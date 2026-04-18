import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: "customer"
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User