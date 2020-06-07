const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    // phone: { type: String, required: true }

});

module.exports = mongoose.model('ShakesClassPost', postSchema);