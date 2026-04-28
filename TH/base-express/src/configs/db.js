import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/base-express')
        console.log('connected to mongodb')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
