import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = {
    authenticate: async (req, res, next) =>{
        try {
            const token = req.headers.mindx_authorization || req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({message: 'Unauthorized: No token provided'})
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.userInfo = {
                email: decoded.email,
                role: decoded.role,
                id: decoded.id
            }
            next();
        } catch (error) {
            // Check if error is specifically jwt related
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                 return res.status(401).json({message: 'Unauthorized: Invalid or expired token'});
            }
            res.status(500).json({message: 'error authenticating', error: error.message})
        }
    }
}
export default authMiddleware;
