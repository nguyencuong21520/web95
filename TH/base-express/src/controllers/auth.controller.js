import Account from '../models/account.model.js';
import Customer from '../models/customer.model.js';
import Manager from '../models/manager.model.js';
import Employee from '../models/employee.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { uploadBufferToCloudinary } from '../middlewares/uploadfile.middleware.js';
dotenv.config();

const AuthController = {
    getProfile: async (req, res) => {
        try {
            const { id, role } = req.userInfo;
            const account = await Account.findById(id).select('-password');
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }

            let profile = null;
            if (role === 'CUSTOMER') {
                profile = await Customer.findOne({ accountId: id });
            } else if (role === 'MANAGER') {
                profile = await Manager.findOne({ accountId: id });
            } else if (role === 'EMPLOYEE') {
                profile = await Employee.findOne({ accountId: id });
            }

            return res.status(200).json({
                message: 'Profile fetched successfully',
                data: {
                    account,
                    profile
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching profile', error: error.message });
        }
    },
    createProfile: async (req, res) => {
        try {
            const { id, email, role } = req.userInfo;
            const { name, phone, address, department, managerId } = req.body;

            let profile;

            if (role === 'CUSTOMER') {
                const exists = await Customer.findOne({ accountId: id });
                if (exists) return res.status(400).json({ message: 'Profile already exists' });
                profile = await Customer.create({ email, name, phone, address, accountId: id });
            } else if (role === 'MANAGER') {
                const exists = await Manager.findOne({ accountId: id });
                if (exists) return res.status(400).json({ message: 'Profile already exists' });
                profile = await Manager.create({ email, name, phone, department, accountId: id });
            } else if (role === 'EMPLOYEE') {
                const exists = await Employee.findOne({ accountId: id });
                if (exists) return res.status(400).json({ message: 'Profile already exists' });
                profile = await Employee.create({ email, name, phone, department, managerId, accountId: id });
            }

            return res.status(201).json({
                message: 'Profile created successfully',
                data: profile
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating profile', error: error.message });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { id, role } = req.userInfo;
            const { email, name, phone, address, department, managerId } = req.body;
            const avatarFile = req.file;

            const account = await Account.findById(id);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }

            let profile = null;
            let avatarUrl;

            if (avatarFile) {
                avatarUrl = await uploadBufferToCloudinary(avatarFile, {
                    folder: `base-express/avatars/${role.toLowerCase()}`,
                    public_id: `${id}-${Date.now()}`
                });
            }

            if (role === 'CUSTOMER') {
                const updateData = {};
                if (name !== undefined) updateData.name = name;
                if (phone !== undefined) updateData.phone = phone;
                if (address !== undefined) updateData.address = address;
                if (email !== undefined) updateData.email = email;
                if (avatarUrl !== undefined) updateData.avatar = avatarUrl;

                profile = await Customer.findOneAndUpdate(
                    { accountId: id },
                    { $set: updateData },
                    { new: true, runValidators: true }
                );
            } else if (role === 'MANAGER') {
                const updateData = {};
                if (name !== undefined) updateData.name = name;
                if (phone !== undefined) updateData.phone = phone;
                if (department !== undefined) updateData.department = department;
                if (email !== undefined) updateData.email = email;
                if (avatarUrl !== undefined) updateData.avatar = avatarUrl;

                profile = await Manager.findOneAndUpdate(
                    { accountId: id },
                    { $set: updateData },
                    { new: true, runValidators: true }
                );
            } else if (role === 'EMPLOYEE') {
                const updateData = {};
                if (name !== undefined) updateData.name = name;
                if (phone !== undefined) updateData.phone = phone;
                if (department !== undefined) updateData.department = department;
                if (managerId !== undefined) updateData.managerId = managerId;
                if (email !== undefined) updateData.email = email;
                if (avatarUrl !== undefined) updateData.avatar = avatarUrl;

                profile = await Employee.findOneAndUpdate(
                    { accountId: id },
                    { $set: updateData },
                    { new: true, runValidators: true }
                );
            }

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found. Please create profile first' });
            }

            return res.status(200).json({
                message: 'Profile updated successfully',
                data: {
                    account: {
                        _id: account._id,
                        email: account.email,
                        role: account.role,
                        isActive: account.isActive
                    },
                    profile
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const account = await Account.findOne({ email })
            if (!account) {
                return res.status(401).json({ message: 'Invalid email or password' })
            }

            if (!account.isActive) {
                return res.status(403).json({ message: 'Account is deactivated' })
            }

            const isPasswordValid = bcrypt.compareSync(password, account.password)

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' })
            }

            const token = jwt.sign(
                { id: account._id, email: account.email, role: account.role },
                process.env.SECRET_KEY,
                { expiresIn: '1d' }
            );
            return res.status(200).json({ message: 'logged in successfully', token: token })

        } catch (error) {
            res.status(500).json({ message: 'error logging in', error: error.message })
        }
    },
    register: async (req, res) => {
        try {
            const { email, password, role } = req.body;

            if (!email || !password) {
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
