    import express from 'express';
    import { connectDB } from './src/configs/db.js';
    import customerRouter from './src/router/customer.router.js';
    import orderRouter from './src/router/order.router.js';
    const app = express();
    const PORT = 3003;

    //connect to mongodb
    connectDB()

    //middleware
    app.use(express.json());

    app.get('/', (req, res)=>{
        res.json({message: 'server is running'})
    })

    app.use('/customers', customerRouter)
    app.use('/orders', orderRouter)
    app.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`)
    })

    // index -> router -> controller -> model 