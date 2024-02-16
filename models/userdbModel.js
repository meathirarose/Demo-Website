const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true
    },

    mobile: {
        type: Number,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    is_admin: {
        type: Number,
        required: true
    },

    is_varified: {
        type: Number,
        required: true,
        default: 1
    }

})

module.exports = mongoose.model('User', userSchema);