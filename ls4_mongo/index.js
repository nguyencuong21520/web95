import express from 'express';
import { connectDB } from './src/configs/db.js';

import UserController from './src/controllers/user.controller.js';
import ProductController from './src/controllers/product.controller.js';
const app = express();
const PORT = 3003

app.use(express.json());

connectDB()

app.get('/', (req, res)=>{
    res.json({message: 'server is running'})
})

app.get('/users',UserController.findAll)
app.get('/users/:id', UserController.findById)
app.post('/users', UserController.create)
app.put('/users/:id', UserController.update)
app.delete('/users/:id', UserController.delete)

app.get('/products', ProductController.findAll)
app.post('/products', ProductController.create)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
