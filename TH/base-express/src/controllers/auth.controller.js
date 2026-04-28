import Account from '../models/account.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const AuthController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const account = await Account.findOne({ email })
            if (!account) {
                return res.status(401).json({ message: 'Invalid email or password' })
            }

            const isPasswordValid = bcrypt.compareSync(password, account.password)

            if(!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' })
            }

            const token = account.email + '-' + account.role + '-' + account.id + '-' + process.env.SECRET_KEY
            return res.status(200).json({ message: 'logged in successfully', token: token })

        } catch (error) {
            res.status(500).json({ message: 'error logging in', error: error.message })
        }
    },
    register: async (req, res) => {
        try {
            const { email, password, role } = req.body;

            if(!email || !password) {
                return res.status(400).json({ message: 'email and password are required' })
            }

            //check if email already exists
            const existingAccount = await Account.findOne({ email })
            if (existingAccount) {
                return res.status(400).json({ message: 'Email already exists' })
            }

            const hashedPassword = bcrypt.hashSync(password, 10)
           
            const account = await Account.create({ email, password: hashedPassword, role: role || 'CUSTOMER' })
            return res.status(201).json({ message: 'account registered successfully', data: account })
        } catch (error) {
            res.status(500).json({ message: 'error registering', error: error.message })
        }
    }
}

export default AuthController;
