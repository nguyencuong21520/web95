import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ls4')
        console.log('connected to mongodb')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}