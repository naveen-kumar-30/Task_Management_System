const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
//const fetch = require('node-fetch'); // Ensure this import is here

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getSignedJwtToken = (id, displayName) => {
    return jwt.sign({ id, displayName }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

exports.registerUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: 'User already exists with this email' });
        }
        user = await User.create({ email, password, firstName, lastName });
        const token = getSignedJwtToken(user._id, user.displayName);
        res.status(201).json({
            success: true,
            token,
            data: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
            },
        });
    } catch (error) {
        console.error('Register user error:', error.message);
        res.status(500).json({ success: false, error: 'Server Error: ' + error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please enter all fields' });
    }
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }
        if (user.password) {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ success: false, error: 'Invalid credentials' });
            }
        } else {
            return res.status(400).json({ success: false, error: 'This account was registered with Google. Please use Google login.' });
        }
        const token = getSignedJwtToken(user._id, user.displayName);
        res.status(200).json({
            success: true,
            token,
            data: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
            },
        });
    } catch (error) {
        console.error('Login user error:', error.message);
        res.status(500).json({ success: false, error: 'Server Error: ' + error.message });
    }
};

// @desc    Authenticate user with Google token
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => { // <--- **THIS IS THE LINE TO VERIFY CAREFULLY**
                                         //      Ensure it's `exports.googleLogin`
    const { token } = req.body; // This 'token' is the Google ID Token from frontend

    if (!token) {
        return res.status(400).json({ success: false, error: 'Google token not provided' });
    }

    let googleProfile;
    try {
        // --- ATTEMPT 1: Verify as ID Token (PREFERRED) ---
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            googleProfile = {
                sub: payload.sub,
                email: payload.email,
                given_name: payload.given_name,
                family_name: payload.family_name,
            };
            console.log("[Google Auth] ID Token verified successfully.");
        } catch (idTokenError) {
            // If ID Token verification fails, it could be an Access Token or an invalid ID Token.
            // Log for debugging but try the Access Token fallback if it looks like one.
            console.warn('[Google Auth] ID Token verification failed:', idTokenError.message, 'Attempting Access Token fallback...');

            // --- ATTEMPT 2: Use Access Token to fetch user info (FALLBACK) ---
            // Only proceed if the token format resembles an Access Token
            if (token.length > 50 && (token.startsWith('ya29.') || token.includes('.'))) { // Basic check for typical access token appearance
                const googleUserInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
                if (!googleUserInfoResponse.ok) {
                    const errorText = await googleUserInfoResponse.text();
                    console.error('[Google Auth] Failed to fetch Google user info with access token:', googleUserInfoResponse.status, errorText);
                    throw new Error(`Failed to fetch Google user info: ${googleUserInfoResponse.statusText}. Details: ${errorText}`);
                }
                const userInfo = await googleUserInfoResponse.json();
                googleProfile = {
                    sub: userInfo.sub || userInfo.id,
                    email: userInfo.email,
                    given_name: userInfo.given_name,
                    family_name: userInfo.family_name,
                };
                console.log("[Google Auth] Access Token used to fetch user info successfully.");
            } else {
                // If it's neither a valid ID Token nor a recognizable Access Token format
                throw new Error('Invalid Google token format or type. Please provide a valid ID Token or Access Token.');
            }
        }

        const { sub: googleId, email, given_name, family_name } = googleProfile;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Could not retrieve email from Google profile.' });
        }

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.findOne({ email });

            if (user) {
                user.googleId = googleId;
                if (!user.firstName && given_name) user.firstName = given_name;
                if (!user.lastName && family_name) user.lastName = family_name;
                await user.save();
            } else {
                user = await User.create({
                    googleId,
                    email,
                    firstName: given_name,
                    lastName: family_name,
                });
            }
        }

        const appToken = getSignedJwtToken(user._id, user.displayName);

        res.status(200).json({
            success: true,
            token: appToken,
            data: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
            },
        });

    } catch (error) {
        console.error('Google login/auth error:', error);
        res.status(401).json({ success: false, error: error.message || 'Google authentication failed' });
    }
};