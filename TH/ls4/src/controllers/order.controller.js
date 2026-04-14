import Order from '../models/order.model.js';

const OrderController = {
    findByCustomerId: async (req, res) =>{
        try {
            const { customerId } = req.params;
            const orders = await Order.find({ customerId })
            res.status(200).json({message: 'orders fetched successfully', data: orders})
        } catch (error) {
            res.status(500).json({message: 'error fetching orders', error: error.message})
        }
    },
    create: async (req, res) =>{
        try {
            // const { customerId, productId, quantity } = req.body;
            //mock data
            const order = {
                customerId: "69de4c0a618ced4d6fab394d",
                productId: "",
                quantity: 2,
                totalPrice: 100000
            }
            await Order.create(order)
            res.status(201).json({message: 'order created successfully', data: order})
        } catch (error) {
            res.status(500).json({message: 'error creating order', error: error.message})
        }
    },
    getHighValue: async (req, res) =>{
        try {
            const value = req.query.value || 100000

            //filter orders by totalPrice >= 100000
            const orders = await Order.find({ totalPrice: { $gte: value } })
            res.status(200).json({message: 'orders fetched successfully', data: orders})
        } catch (error) {
            res.status(500).json({message: 'error fetching orders', error: error.message})
        }
    }
}

export default OrderController;