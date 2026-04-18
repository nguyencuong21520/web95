const AuthController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username, password })
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' })
            }
            const token = user.username + '-' + user.role + '-' + "ilovemindx"
            return res.status(200).json({ message: 'user logged in successfully', token: token })

        } catch (error) {
            res.status(500).json({ message: 'error logging in', error: error.message })
        }
    },
    register: async (req, res) => {
        try {
            const { username, password, role } = req.body;
            //check if user already exists
            const existingUser = await User.findOne({ username })
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' })
            }
            const user = await User.create({ username, password, role })
            return res.status(201).json({ message: 'user registered successfully', data: user })
        } catch (error) {
            res.status(500).json({ message: 'error registering', error: error.message })
        }
    }
}

export default AuthController;