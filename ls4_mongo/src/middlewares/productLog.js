const productLog = (req, res, next) => {
    console.log(`product log: ${req.method} ${req.url}`);
    next(); 
}

export default productLog;