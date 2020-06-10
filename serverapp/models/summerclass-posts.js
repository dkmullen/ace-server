const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    teacher: { type: String },
    classname: { type: String }

});

module.exports = mongoose.model('SummerClassPost', postSchema);