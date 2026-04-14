import Customer from '../models/customer.model.js';

const CustomerController = {
    findAll: async (req, res) => {
        try {
            const customers = await Customer.find()
            res.status(200).json({message: 'customers fetched successfully', data: customers})
        } catch (error) {
            res.status(500).json({message: 'error fetching customers', error: error.message})
        }
    },
    create: async (req, res) =>{
        try {
            const { name, email, age } = req.body;
            if(!name || !email || age === undefined){
                return res.status(400).json({message: 'name, email, age are required'})
            }
            const customer = await Customer.create({ name, email, age })
            res.status(201).json({message: 'customer created successfully', data: customer})
        } catch (error) {
            res.status(500).json({message: 'error creating customer', error: error.message})
        }
    },
    findById: async (req, res) =>{
        try {
            const { id } = req.params;
            const customer = await Customer.findById(id)
            res.status(200).json({message: 'customer fetched successfully', data: customer})
        } catch (error) {
            res.status(500).json({message: 'error fetching customer', error: error.message})
        }
    }
}

export default CustomerController;