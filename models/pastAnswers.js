var mongoose = require('mongoose')

var PastAnswerSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    questionId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    correct : {
        type : Boolean,
        required : true
    }
})
	

var PastAnswer = mongoose.model('PastAnswer', PastAnswerSchema, 'pastanswers')
module.exports = PastAnswer;

