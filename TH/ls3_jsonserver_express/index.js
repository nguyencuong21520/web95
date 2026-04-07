import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const app = express();
app.use(express.json());
const PORT = 3002;
const JSON_SERVER_URL = 'http://localhost:3001';


const getJsonServerData = async (path) => {
    try {
        const response = await axios.get(`${JSON_SERVER_URL}${path}`);
        return { ok: true, status: response.status, data: response.data };
    } catch (error) {
        if (error.response) {
            return { ok: false, status: error.response.status, data: error.response.data };
        }
        throw error;
    }
}

app.get('/', (req, res)=>{
    res.json({message: 'server is running'})
})

//Get all customers
app.get("/customers", async (req, res) =>{
    try {
        const {ok, status, data} = await getJsonServerData('/customers');
        if (!ok) return res.status(status).json({ error: "Failed to fetch customers" });
        res.json({message: 'customers fetched successfully', data: data})
    } catch (error) {
        res.status(500).json({message: 'error fetching customers', error: error.message})
    }
})
//Get customer by id
app.get("/customers/:id", async (req, res) =>{
    try {
        const {ok, status, data} = await getJsonServerData(`/customers/${req.params.id}`);
        if (!ok) return res.status(status).json({ error: "Failed to fetch customer" });
        res.json({message: 'customer fetched successfully', data: data})
    } catch (error) {
        res.status(500).json({message: 'error fetching customer', error: error.message})
    }
})
//Get orders by customer id customers/:customerId/orders
app.get("/customers/:customerId/orders", async (req, res)=>{
    try {
        const customerId = req.params.customerId
        const {ok, status, data} = await getJsonServerData(`/orders?customerId=${customerId}`);
        if (!ok) return res.status(status).json({ error: "Failed to fetch orders" });
        res.json({message: 'orders fetched successfully', data: data})

    } catch (error) {
        res.status(500).json({message: 'error fetching orders', error: error.message})
    }
})

//Get orders by high value
app.get("/orders/highvalue", async (req, res)=>{
    try {
        //get all orders
        const {ok, status, data} = await getJsonServerData(`/orders`);
        if (!ok) return res.status(status).json({ error: "Failed to fetch orders" });
        //filter orders by totalPrice > 10000000
        const highValueOrders = data.filter(order => order.totalPrice > 10000000);
        res.json({message: 'orders fetched successfully', data: highValueOrders})
    } catch (error) {
        res.status(500).json({message: 'error fetching orders', error: error.message})
    }
})

//Get products by price range
//products/price-range?minPrice=5000000&maxPrice=10000000
app.get("/products/price-range", async (req, res)=>{
    try {
        const { minPrice, maxPrice } = req.query;
        const { ok, status, data: products } = await getJsonServerData(`/products`);
        if (!ok) return res.status(status).json({ error: "Failed to fetch products" });
        if(!minPrice && !maxPrice){
            return res.json({ message: "products fetched successfully", data: products });
        }

        const min = minPrice  ? Number(minPrice) : null;
        const max = maxPrice  ? Number(maxPrice) : null;

        if(min && max){
            const filteredProducts = products.filter(product => product.price >= min && product.price <= max);
            return res.json({ message: "products fetched successfully", data: filteredProducts });
        }
        if(min && !max){
            const filteredProducts = products.filter(product => product.price >= min);
            return res.json({ message: "products fetched successfully", data: filteredProducts });
        }
        if(!min && max){
            const filteredProducts = products.filter(product => product.price <= max);
            return res.json({ message: "products fetched successfully", data: filteredProducts });
        }
        return res.json({ message: "products fetched successfully", data: products });
    } catch (error) {
        res.status(500).json({message: 'error fetching products', error: error.message})
    }   
})
//Add new customer
app.post("/customers", async (req, res)=>{
    try {
        const {name, email, age} = req.body;
        //validate request body
        if (!name || !email || age === undefined) {
            return res.status(400).json({ error: "name, email, age are required" });
        }
        //check if email already exists
        const existingCustomer = await getJsonServerData(`/customers?email=${email}`);
        if (existingCustomer.ok && existingCustomer.data.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }
        //create new customer
        const createCustomer= await axios.post(`${JSON_SERVER_URL}/customers`, {id: uuidv4(), name, email, age});
        if (createCustomer.status !== 201) {
            return res.status(createCustomer.status).json({ error: "Failed to add customer" });
        }
        //return response
        res.status(201).json({message: 'customer added successfully', data: createCustomer.data})
    } catch (error) {
        res.status(500).json({message: 'error adding customer', error: error.message})
    }
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})