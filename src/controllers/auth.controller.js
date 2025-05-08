const passport = require('passport');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
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

  forgot_password: async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SESSION_SECRET,
      { expiresIn: '1h' }
    );
    
    // Store token with expiration
    // passwordResetTokens[token] = {
    //   userId: user.id,
    //   expiresAt: new Date(Date.now() + 3600000) // 1 hour
    // };
    
    // console.log(`Reset link: http://localhost:5173/reset-password?token=${token}`);
    
    // In a real app, send an email with the reset link
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const message = `Click the link to reset your password: ${resetUrl}`;

    await sendEmail(user.email, 'Reset your password', message);
    
    res.status(200).json({ message: 'Password reset email sent' });
  
  },

  verify_token: (token) => {
    // const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ valid: false, message: 'Token is required' });
    }
    
    try {
      // Verify token
      jwt.verify(token, process.env.SESSION_SECRET);
      
      // Check if token exists in our store and is not expired
      // const tokenData = passwordResetTokens[token];
      if (!token || new Date() > new Date(token.expiresAt)) {
        return res.status(400).json({ valid: false, message: 'Token is invalid or expired' });
      }
      
      res.status(200).json({ valid: true });
    } catch (error) {
      res.status(400).json({ valid: false, message: 'Invalid token' });
    }
  },

  reset_password: async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }
    
    try {
      // Verify token

      // jwt.verify(token, process.env.SESSION_SECRET);
      verify_token(token)
      // Check if token exists in our store and is not expired
      // const tokenData = passwordResetTokens[token];
      if (!token || new Date() > new Date(token.expiresAt)) {
        return res.status(400).json({ message: 'Token is invalid or expired' });
      }
      
      // Find user
      const userIndex = User.findIndex(token.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update password (in a real app, hash the password)
      const hashedPassword = crypto.SHA256(password).toString();
      users[userIndex].password = hashedPassword;
      
      // Invalidate token
      delete token;
      
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },

};

module.exports = authController;