const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const user = new User({
        name,
        email,
        phone,
        password
      });

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  },

  // Login user
  login: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email, name: user.name },
          process.env.SESSION_SECRET,
          { expiresIn: '1h' } // Token expiration time
        );

        return res.json({ 
          message: 'Login successful', 
          token,
          user: { id: user._id, email: user.email, name: user.name }
        });

      });
    })(req, res, next);
  },

  // Logout user
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out', error: err.message });
      }
      res.json({ message: 'Logout successful' });
    });
  },

  // Get current user
  getCurrentUser: (req, res) => {
    console.log('here')
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ user: { id: req.user._id, email: req.user.email, name: req.user.name } });
  },

};

module.exports = authController;