const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    school: { type: String, required: true },
    title: { type: String, required: true },
    entryType: { type: String, required: true },
    videolink: { type: String, required: true },
});

module.exports = mongoose.model('Singing2021Post', postSchema);