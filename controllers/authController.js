const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Sponsor = require('../models/Sponsor');
const Kid = require('../models/Kid');

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        let status = 'approved'; 
        if (user.role === 'sponsor') {
            const sponsor = await Sponsor.findOne({ user: user._id });
            status = sponsor ? sponsor.status : 'pending'; 
        } else if (user.role === 'kid') {
            const kid = await Kid.findOne({ user: user._id });
            status = kid ? kid.status : 'pending'; 
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role, status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

