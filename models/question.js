var mongoose = require('mongoose')

var questionSchema = new mongoose.Schema({
    question:  String,
    answers: [{
        text : String,
        correct : Boolean
    }],
    rationale: {type:String, default: 'Rationale goes here'},
    lessonNumber: String,
    lessonName: String,
    section: String
})
	

var Question = mongoose.model('question', questionSchema, 'questions')
module.exports = Question;
