const authMiddleware = {
    authenticate: async (req, res, next) =>{
        try {
            const token = req.headers.mindx_authorization
            const [username, role, secret] = token.split('-')
            if(secret !== "ilovemindx"){
                return res.status(401).json({message: 'Unauthorized'})
            }
            next();
        } catch (error) {
            res.status(500).json({message: 'error authenticating', error: error.message})
        }
    }
}
export default authMiddleware;