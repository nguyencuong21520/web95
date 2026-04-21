import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
const UserController = {
    findAll: async (req, res) =>{
        try {
            const users = await User.find()
            res.status(200).json({message: 'users fetched successfully', data: users})
        } catch (error) {
            res.status(500).json({message: 'error fetching users', error: error.message})
        }
    },
    findById: async (req, res) =>{
        try {
            const { id } = req.params;
            const user = await User.findById(id)
            res.status(200).json({message: 'user fetched successfully', data: user})
        } catch (error) {
            res.status(500).json({message: 'error fetching user', error: error.message})
        }
    },
    create: async (req, res) =>{
        try {
            const { userName, email, password } = req.body;
            const user = await User.create({ userName, email, password })
            res.status(201).json({message: 'user created successfully', data: user})
        } catch (error) {
            res.status(500).json({message: 'error creating user', error: error.message})
        }
    },
    update: async (req, res) =>{
        try {
            const { id } = req.params;
            const { userName, email, password } = req.body;
            const user = await User.findByIdAndUpdate(id, { userName, email, password }, { new: true })
            res.status(200).json({message: 'user updated successfully', data: user})
        } catch (error) {
            res.status(500).json({message: 'error updating user', error: error.message})
        }
    },
    delete: async (req, res) =>{
        try {
            const { id } = req.params;
            await User.findByIdAndDelete(id)
            res.status(200).json({message: 'user deleted successfully'})
        } catch (error) {
            res.status(500).json({message: 'error deleting user', error: error.message})
        }
    },
    login: async (req, res) =>{
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username, password })
            if(!user){
                return res.status(401).json({message: 'Invalid username or password'})
            }
            //compare password
                //get salt
                const userSalt = user.salt
                const passwordHash = bcrypt.hashSync(password, userSalt)
                
                if(passwordHash !== user.password){
                    return res.status(401).json({message: 'Invalid username or password'})
                }
            //convert user to object
            const userObject = user.toObject();
            const token = userObject.username + '-' + userObject.role + '-' + "ilovemindx"
            res.status(200).json({message: 'user logged in successfully', token: token})
        } catch (error) {
            res.status(500).json({message: 'error logging in', error: error.message})
        }
    },
    register: async (req, res) =>{
        try {
            const { username, email, password, role } = req.body;
            //check if user already exists by email
            const existingUser = await User.findOne({ email })
            if(existingUser){
                return res.status(400).json({message: 'User already exists'})
            }
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword =bcrypt.hashSync(password, salt)
            //create user
            const user = await User.create({ username, email, password: hashedPassword, role, salt })

            res.status(201).json({message: 'user registered successfully', data: user})
        } catch (error) {
            res.status(500).json({message: 'error registering user', error: error.message})
        }
    }
}

export default UserController;