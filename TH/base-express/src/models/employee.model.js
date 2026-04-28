import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    },
    department: {
        type: String
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
