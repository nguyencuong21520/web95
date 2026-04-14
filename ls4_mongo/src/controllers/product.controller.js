import Product from '../models/product.model.js';
const ProductController = {
    findAll: async (req, res) =>{
        try {
            const products = await Product.find()
            res.status(200).json({message: 'products fetched successfully', data: products})
        } catch (error) {
            res.status(500).json({message: 'error fetching products', error: error.message})
        }
    },
    create: async (req, res) =>{
        try {
            const { name, price, quantity } = req.body;
            const product = await Product.create({ name, price, quantity })
            res.status(201).json({message: 'product created successfully', data: product})
        } catch (error) {
            res.status(500).json({message: 'error creating product', error: error.message})
        }
    }
}

export default ProductController;