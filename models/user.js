var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    name:  String,
    email: {
	type : String,
	unique : true
    },
    password: String,
    created: {
	type: Number,
	default: function(){ return Date.now() }
    },

    // an object with question IDs as keys, a # of correct answers for that question as the value
    pastAnswers : {
        type : Object,
        default: {}
    },
    pastLessonDates : {
        type : [Date],
        default: [new Date(1)],
    },
    currentDayStreak : {
        type: Number,
        default: 0
    },
    lessonMastery : {
        type: Object,
        default: {}
    }
}, {minimize:false})
	

var User = mongoose.model('User', UserSchema, 'users')
module.exports = User;
