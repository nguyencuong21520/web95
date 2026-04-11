    import express from 'express';
    import { connectDB } from './src/configs/db.js';
    import Product from './src/models/product.model.js';
    import Customer from './src/models/customer.model.js';
    import Order from './src/models/order.model.js';

    const app = express();
    const PORT = 3003;

    //connect to mongodb
    connectDB()

    //middleware
    app.use(express.json());

    app.get('/', (req, res)=>{
        res.json({message: 'server is running'})
    })

    //create a product
    app.post('/products', async (req, res)=>{
        const { name, price, quantity } = req.body;
        try {
            const product = await Product.create({ name, price, quantity })
            res.status(201).json({message: 'product created successfully', data: product})
        } catch (error) {
            res.status(500).json({message: 'error creating product', error: error.message})
        }
    })

    //get all products
    app.get('/products', async (req, res)=>{
        try {
            const products = await Product.find()
            res.status(200).json({message: 'products fetched successfully', data: products})
        } catch (error) {
            res.status(500).json({message: 'error fetching products', error: error.message})
        }
    })


    app.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`)
    })