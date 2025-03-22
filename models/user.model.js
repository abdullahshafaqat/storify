const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [10, "Username must be at least 10 characters long"]
     },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [15, "Email must be at least 15 characters long"]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, "Password must be at least 6 characters long"]
    }
})
const User = mongoose.model('User', userSchema);
module.exports = User;