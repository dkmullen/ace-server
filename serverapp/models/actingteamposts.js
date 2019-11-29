const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    school: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    dramaticName: { type: String, required: true },
    dramaticGrade: { type: String, required: true },
    comedicName: { type: String, required: true },
    comedicGrade: { type: String, required: true },
    shakespeareName: { type: String, required: true },
    shakespeareGrade: { type: String, required: true },
    musicalName: { type: String, required: true },
    musicalGrade: { type: String, required: true },
});

module.exports = mongoose.model('ActingTeamPost', postSchema);