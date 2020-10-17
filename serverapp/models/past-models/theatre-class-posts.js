const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    parent: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    student1: {
        name: { type: String, required: true },
        age: { type: Number , required: true }
    },
    student2: {
        name: { type: String, required: false },
        age: { type: Number , required: false }
    },
    student3: {
        name: { type: String, required: false },
        age: { type: Number , required: false }
    },
    student4: {
        name: { type: String, required: false },
        age: { type: Number , required: false }
    }
});

module.exports = mongoose.model('TheatreCampPost', postSchema);