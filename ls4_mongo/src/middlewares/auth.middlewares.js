import dotenv from 'dotenv';
dotenv.config();
const authMiddleware= {
    authenticate: (req, res, next) => {
        try {
            const token = req.body.token
            const [username, role, secret] = token.split('-')
            if(secret == process.env.JWT_SECRET){
                next()
                return
            }
            return res.status(401).json({message: 'Unauthorized'})
        } catch (error) {
            return res.status(500).json({message: 'error authenticating', error: error.message})
        }
    },
    authorize: (req, res, next) => {
        try{
            const token = req.body.token
            const [username, role, secret] = token.split('-')
            if(role === "admin"){
                next()
                return
            }
            return res.status(403).json({message: 'Forbidden'})
        } catch (error) {
            return res.status(500).json({message: 'error authorizing', error: error.message})
        }
    }   
}

export default authMiddleware;