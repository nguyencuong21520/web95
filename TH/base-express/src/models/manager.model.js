import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    department: {
        type: String
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
}, { timestamps: true });

const Manager = mongoose.model('Manager', managerSchema);
export default Manager;
