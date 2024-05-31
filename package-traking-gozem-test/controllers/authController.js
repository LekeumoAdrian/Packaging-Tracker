const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.create({ username, password, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const now = new Date();
    const expiresDate = now.getTime() + 60 * 60 * 24  * 1000;
    res.status(201).json({ success: true, message: 'User created successfully', username: user.username, role: user.role, token : token, expireDate: expiresDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error'});
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const now = new Date();
    const expiresDate = now.getTime() + 60 * 60 * 24  * 1000;
    res.status(200).json({ success: true, message: 'User created successfully', username: user.username, role: user.role, token : token, expireDate: expiresDate});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
