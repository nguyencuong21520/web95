import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './src/configs/db.js';
import authRouter from './src/router/auth.router.js';
import authMiddleware from './src/middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

//connect to mongodb
connectDB()

//middleware
app.use(express.json());

app.get('/', (req, res)=>{
    res.json({message: 'server is running'})
})

//routes
app.use('/auth', authRouter)

// example: app.use('/protected-route', authMiddleware.authenticate, protectedRouter)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})

// index -> router -> controller -> model
