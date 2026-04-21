import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

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
            const {customerId, productId, quantity} = req.body;

            const product = await Product.findById(productId)
            if(!product){
                return res.status(404).json({message: 'product not found'})
            }

            //check quantity
            if(quantity > product.quantity){
                return res.status(400).json({message: 'quantity exceeds available stock'})
            }

            // calculate total price
            const totalPrice = product.price * quantity;

            //create order
            const order = await Order.create({customerId, productId, quantity, totalPrice})

            if(!order){
                return res.status(500).json({message: 'error creating order'})
            }

            //update product quantity
            await Product.findByIdAndUpdate(productId, {quantity: product.quantity - quantity})

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
    },
    updateQuantity: async (req, res) =>{
        try {
            const orderId = req.params.orderId;
            const {quantity} = req.body;

            const order = await Order.findById(orderId)
            if(!order){
                return res.status(404).json({message: 'order not found'})
            }

            //kiểm tra xem tăng hay giảm quantity
            //nếu giảm
            if(quantity < order.quantity){
                //update order quantity
                await Order.findByIdAndUpdate(orderId, {quantity: quantity})
                // số lượng chênh
                const difference = order.quantity - quantity;
                //update product quantity
                await Product.findByIdAndUpdate(order.productId, {quantity: product.quantity + difference})

                return res.status(200).json({message: 'order updated successfully', data: order})
            }

            if(quantity > order.quantity){
                // Kiểm tra số lượng tồn kho của sản phẩm
                const product = await Product.findById(order.productId)
                if(!product){
                    return res.status(404).json({message: 'product not found'})
                }

                // Kiểm tra số lượng tồn kho có đủ không
                if(quantity > product.quantity){
                    return res.status(400).json({message: 'quantity exceeds available stock'})
                }

                //update order quantity
                await Order.findByIdAndUpdate(orderId, {quantity: quantity})
                // số lượng chênh
                const difference = quantity - order.quantity;
                //update product quantity
                await Product.findByIdAndUpdate(order.productId, {quantity: product.quantity - difference})

                return res.status(200).json({message: 'order updated successfully', data: order})
            }   

            return res.status(200).json({
                message: 'nothing to update',
            })
        } catch (error) {
            res.status(500).json({message: 'error updating order', error: error.message})
        }
    },
    getOrdersByCustomerId: async (req, res) =>{
        try {
            const { customerId } = req.params;
            const userId = req.userInfo.id;
            const userRole = req.userInfo.role;

            if(userId !==customerId && userRole !== 'admin'){
                return res.status(403).json({message: 'Forbidden'})
            }
            const orders = await Order.find({ customerId })
            res.status(200).json({message: 'orders fetched successfully', data: orders})
        } catch (error) {
            res.status(500).json({message: 'error fetching orders', error: error.message})
        }
    }
}

export default OrderController;