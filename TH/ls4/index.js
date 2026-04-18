    import express from 'express';
    import { connectDB } from './src/configs/db.js';
    import customerRouter from './src/router/customer.router.js';
    import orderRouter from './src/router/order.router.js';
    import authMiddleware from './src/middlewares/auth.middleware.js';
    import authRouter from './src/router/auth.router.js';
    const app = express();
    const PORT = 3003;

    //connect to mongodb
    connectDB()

    //middleware
    app.use(express.json());

    app.get('/', (req, res)=>{
        res.json({message: 'server is running'})
    })

    app.use('/auth', authRouter)
    app.use('/customers', authMiddleware.authenticate, customerRouter)
    app.use('/orders', authMiddleware.authenticate, orderRouter)


    app.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`)
    })

    // index -> router -> controller -> model 