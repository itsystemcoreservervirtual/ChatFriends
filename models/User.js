const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    password: {
        type: String,
        required: true 
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150' 
    },
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }]
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
