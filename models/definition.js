var mongoose = require('mongoose')

var definitionSchema = new mongoose.Schema({
    definitionName:  String,
    definitionTag: String,
    definition: String,
    lessonNumber: String,
    lessonName: String
})
	

var Definition = mongoose.model('definition', definitionSchema, 'definitions')
module.exports = Definition;
