const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    school: { type: String, required: true },
    link: { type: String, required: true },
});

module.exports = mongoose.model('SaferAtHomePost', postSchema);