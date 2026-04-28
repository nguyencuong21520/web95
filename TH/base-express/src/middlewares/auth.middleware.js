import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = {
    authenticate: async (req, res, next) =>{
        try {
            const token = req.headers.mindx_authorization
            const [email, role, id, secret] = token.split('-')
            if(secret !== process.env.SECRET_KEY){
                return res.status(401).json({message: 'Unauthorized'})
            }
            req.userInfo = {
                email,
                role,
                id
            }
            next();
        } catch (error) {
            res.status(500).json({message: 'error authenticating', error: error.message})
        }
    }
}
export default authMiddleware;
