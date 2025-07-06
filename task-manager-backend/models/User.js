const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: function() { return !this.googleId; },
        minlength: 6,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    displayName: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isNew || this.isModified('firstName') || this.isModified('lastName') || !this.displayName) {
        if (this.firstName && this.lastName) {
            this.displayName = `${this.firstName} ${this.lastName}`;
        } else if (this.firstName) {
            this.displayName = this.firstName;
        } else if (this.email) {
            this.displayName = this.email.split('@')[0];
        } else {
            this.displayName = 'User';
        }
    }
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);