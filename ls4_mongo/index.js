import express from 'express';
import { connectDB } from './src/configs/db.js';

import userRouter from './src/router/user.router.js';
import productRouter from './src/router/product.router.js';
import logRequest from './src/middlewares/logRequest.js';
import userLog from './src/middlewares/userLog.js';
import productLog from './src/middlewares/productLog.js';
import validate from './src/middlewares/validate.js';
const app = express();
const PORT = 3003

app.use(express.json());
app.use(logRequest);

connectDB()

app.get('/', (req, res)=>{
    res.json({message: 'server is running'})
})

app.use('/users',userLog, validate, userRouter)
app.use('/products', productLog, productRouter)


app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
