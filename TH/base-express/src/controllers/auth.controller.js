import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const AuthController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' })
            }

            const hashedPassword = bcrypt.hashSync(password, user.salt)

            if(hashedPassword !== user.password) {
                return res.status(401).json({ message: 'Invalid username or password' })
            }

            const token = user.username + '-' + user.role + '-' + user.id + '-' + process.env.SECRET_KEY
            return res.status(200).json({ message: 'user logged in successfully', token: token })

        } catch (error) {
            res.status(500).json({ message: 'error logging in', error: error.message })
        }
    },
    register: async (req, res) => {
        try {
            const { username, password, role, email } = req.body;

            if(!username || !password || !role || !email) {
                return res.status(400).json({ message: 'username, password, role, email are required' })
            }

            //check if email already exists
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' })
            }

            //generate salt
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(password, salt)
           
            const user = await User.create({ username, password: hashedPassword, role, email, salt})
            return res.status(201).json({ message: 'user registered successfully', data: user })
        } catch (error) {
            res.status(500).json({ message: 'error registering', error: error.message })
        }
    }
}

export default AuthController;
