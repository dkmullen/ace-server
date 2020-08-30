const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    school: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    videolink: { type: String, required: true },
    entryType: { type: String, required: true }
});

module.exports = mongoose.model('NationalPost', postSchema);