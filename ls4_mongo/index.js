import express from 'express';
import { connectDB } from './src/configs/db.js';
import User from './src/models/user.model.js';
import Product from './src/models/product.model.js';

const app = express();
const PORT = 3003

app.use(express.json());

connectDB()

app.get('/', (req, res)=>{
    res.json({message: 'server is running'})
})

app.get('/users', async (req, res)=>{
    try {
        const users = await User.find()
        res.status(200).json({message: 'users fetched successfully', data: users})
    } catch (error) {
        res.status(500).json({message: 'error fetching users', error: error.message})
    }
})

//get user by id
app.get('/users/:id', async (req, res)=>{
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password')
        res.status(200).json({message: 'user fetched successfully', data: user})
    } catch (error) {
        res.status(500).json({message: 'error fetching user', error: error.message})
    }
})

app.post('/users', async (req, res)=>{
    const { userName, email, password } = req.body;
    try {
        const user = await User.create({ userName, email, password })
        res.status(201).json({message: 'user created successfully', data: user})
    } catch (error) {
        res.status(500).json({message: 'error creating user', error: error.message})
    }
})

app.post('/products', async (req, res)=>{
    const { name, price, quantity } = req.body;
    try {
        const product = await Product.create({ name, price, quantity })
        res.status(201).json({message: 'product created successfully', data: product})
    } catch (error) {
        res.status(500).json({message: 'error creating product', error: error.message})
    }
})

// update user by id
app.put('/users/:id', async (req, res)=>{
    const { id } = req.params;
    const { userName, email, password } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { userName, email, password }, { new: true })
        res.status(200).json({message: 'user updated successfully', data: user})
    } catch (error) {
        res.status(500).json({message: 'error updating user', error: error.message})
    }
})

// delete user by id
app.delete('/users/:id', async (req, res)=>{
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({message: 'user deleted successfully'})
    } catch (error) {
        res.status(500).json({message: 'error deleting user', error: error.message})
    }
})

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
