const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
    school: { type: String, required: true },
    rising: Boolean,
    individualVocal: Boolean,
    individualInstrumental: Boolean,
    group: Boolean
});

module.exports = mongoose.model('Post', postSchema);