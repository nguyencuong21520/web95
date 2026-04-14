import User from '../models/user.model.js';
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
    }
}

export default UserController;