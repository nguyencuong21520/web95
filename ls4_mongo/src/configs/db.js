import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://nguyencuong21520:Menu00d1@nvc.bl27lke.mongodb.net/web95')
        console.log('connected to mongodb')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}