const validate = (req, res, next) => {
    const userName = req.body.userName;

    if(!userName){
        return res.status(400).json({ message: 'userName is required' });
    }

    next();
}

export default validate;