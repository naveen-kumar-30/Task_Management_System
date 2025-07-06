const express = require('express');
const router = express.Router();

// Import the User model, needed for interacting with user data in the profile routes
const User = require('../models/User'); // ⭐ VERIFY THIS PATH IS CORRECT for your User.js model ⭐

// Import the 'protect' middleware to secure routes that require authentication
// We destructure it because authMiddleware.js exports { protect }
const { protect } = require('../middleware/authMiddleware'); // ⭐ VERIFY THIS PATH IS CORRECT for your authMiddleware.js file ⭐

// Import your authentication controller functions (for register, login, google)
// Assuming these are defined in '../controllers/authController.js'
const { registerUser, loginUser, googleLogin } = require('../controllers/authController');


// --- Public Authentication Routes (No Protection Needed) ---

// Route for new user registration
// Handles POST requests to /api/auth/register
router.post('/register', registerUser);

// Route for existing user login
// Handles POST requests to /api/auth/login
router.post('/login', loginUser);

// Route for Google OAuth login/registration
// Handles POST requests to /api/auth/google
router.post('/google', googleLogin);




// --- Protected User Profile Routes ---

// GET /api/auth/profile
// This route fetches the authenticated user's profile data.
// The 'protect' middleware ensures only logged-in users can access this.
router.get('/profile', protect, async (req, res) => {
    try {
        // The 'protect' middleware already attached the user's details to `req.user`.
        // This `req.user` object contains the user document (excluding password) from the database.
        if (!req.user) {
            // This case should ideally not be reached if 'protect' middleware functions correctly,
            // but it acts as a safeguard.
            return res.status(404).json({ success: false, error: 'User not found or not authenticated.' });
        }

        // Send back the user's profile data.
        // `displayName` will be correctly set by the pre('save') hook in your User model
        // and should be present on `req.user`.
        res.json({
            success: true,
            message: 'User profile fetched successfully!',
            data: {
                _id: req.user._id, // MongoDB ID of the user
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                displayName: req.user.displayName, // The calculated display name
                // Add any other user fields from req.user that you want the frontend to receive
                // e.g., date: req.user.date, profilePicture: req.user.profilePictureUrl
            }
        });

    } catch (err) {
        // Log the full error for server-side debugging purposes
        console.error('Error fetching user profile:', err);
        // Send a generic 500 server error response to the client
        res.status(500).json({ success: false, error: 'Server error during profile fetch. Please try again later.' });
    }
});

// PUT /api/auth/profile
// This route allows an authenticated user to update their profile information (name, email).
// The 'protect' middleware ensures only logged-in users can access this.
router.put('/profile', protect, async (req, res) => {
    try {
        // Destructure the fields that can be updated from the request body.
        const { firstName, lastName, email } = req.body;

        // Ensure `req.user` and `req.user._id` are available from the 'protect' middleware.
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, error: 'Authentication required: User ID not available.' });
        }

        // Find the user document in MongoDB using the ID from the authenticated token.
        let user = await User.findById(req.user._id);

        // If for some reason the user is not found, return a 404.
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found in database.' });
        }

        // --- Update User Fields Conditionally ---
        // Only update a field if it's provided in the request body AND it's different from the current value.
        // This allows for partial updates (sending only the fields you want to change).

        if (firstName !== undefined && firstName !== user.firstName) {
            user.firstName = firstName;
        }

        if (lastName !== undefined && lastName !== user.lastName) {
            user.lastName = lastName;
        }

        if (email !== undefined && email !== user.email) {
            // Important: Before updating the email, check if the new email is already in use by another account.
            const existingUserWithNewEmail = await User.findOne({ email });

            // If an existing user is found with the new email AND that user is NOT the current user,
            // then the email is already taken.
            if (existingUserWithNewEmail && existingUserWithNewEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, error: 'Email already in use by another account.' });
            }
            user.email = email; // Update the email
        }

        // --- Save the Updated User Document ---
        // Calling `user.save()` will trigger the `pre('save')` hook defined in your `User.js` model.
        // This hook will automatically re-generate the `displayName` based on any updated first/last name.
        await user.save();

        // --- Send Success Response ---
        // Respond with a success message and the updated user data.
        // Include the `displayName` which might have been re-generated.
        res.json({
            success: true,
            message: 'Profile updated successfully!',
            data: {
                displayName: user.displayName, // Send the newly computed display name
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                // Add any other relevant user data you want the frontend to immediately update
            }
        });

    } catch (err) {
        // --- Error Handling ---
        // Log the full error object for detailed debugging on the server console.
        console.error('Error updating user profile:', err);

        // Handle Mongoose validation errors (e.g., if the email format is invalid)
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            return res.status(400).json({ success: false, error: errors.join(', ') });
        }

        // Catch-all for any other unexpected server errors during the update process
        res.status(500).json({ success: false, error: 'Server error during profile update. Please try again.' });
    }
});


// Export the router so it can be used by server.js
module.exports = router;