const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) { // If user not found in DB
                return res.status(401).json({ success: false, error: 'User not found for this token.' });
            }

            // Ensure displayName is set on req.user for consistency
            if (decoded.displayName) {
                req.user.displayName = decoded.displayName;
            } else if (!req.user.displayName) {
                if (req.user.firstName && req.user.lastName) {
                    req.user.displayName = `${req.user.firstName} ${req.user.lastName}`;
                } else if (req.user.firstName) {
                    req.user.displayName = req.user.firstName;
                } else if (req.user.email) {
                    req.user.displayName = req.user.email.split('@')[0];
                } else {
                    req.user.displayName = 'User';
                }
            }
            next();
        } catch (error) {
            console.error('Authentication error:', error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, error: 'Token expired. Please log in again.' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ success: false, error: 'Invalid token. Not authorized.' });
            }
            return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized, no token provided.' });
    }
};

module.exports = { protect };