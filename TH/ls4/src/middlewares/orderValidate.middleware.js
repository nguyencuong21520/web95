const orderValidateMiddleware = (req, res, next) =>{
    try {
        const {customerId, productId, quantity} = req.body;
        if(!customerId || !productId || !quantity){
            return res.status(400).json({message: 'customerId, productId, quantity are required'})
        }
        next();
    } catch (error) {
        return res.status(500).json({message: 'error validating order', error: error.message})
    }
}

export default orderValidateMiddleware;