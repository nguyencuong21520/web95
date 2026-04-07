import express from 'express';
import axios from 'axios';

const app = express();
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})