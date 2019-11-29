const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    school: { type: String, required: true },
    dramaticMonologue: Boolean,
    comedicMonologue: Boolean,
    shakespeareMonologue: Boolean,
    musical: Boolean
});

module.exports = mongoose.model('ActingPost', postSchema);