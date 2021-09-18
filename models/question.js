const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    wrong1: {
        type: String,
        required: true
    },
    wrong2: {
        type: String,
        required: true
    },
    wrong3: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;