const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    event: { type: String, required: true},
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    age: { type: Number, required: true },
    grade: { type: String },
    school: { type: String },
    city: { type: String },
    state: { type: String },
    videolink: { type: String },
    entryType: { type: String },
    imagePath: { type: String }
});

module.exports = mongoose.model('SignupPost', postSchema);