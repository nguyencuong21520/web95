import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './src/configs/db.js';

import userRouter from './src/router/user.router.js';
import productRouter from './src/router/product.router.js';
import productLog from './src/middlewares/productLog.js';
import authMiddleware from './src/middlewares/auth.middlewares.js';
const app = express();
const PORT = process.env.PORT

connectDB()

app.use(express.json());
// 

app.get('/', (req, res)=>{
    res.json({message: 'server is running'})
})

app.use('/users', userRouter)
app.use('/products', authMiddleware.authenticate, authMiddleware.authorize, productRouter)


app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
