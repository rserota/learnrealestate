var mongoose = require('mongoose')

var SectionTotalSchema = new mongoose.Schema({
    'Law And Practice' : {
        type : Number,
        required : true
    },
    total: {
        type : Number,
        required: true
    },
})
	

var sectionTotals = mongoose.model('SectionTotal', SectionTotalSchema, 'sectiontotal')

module.exports = sectionTotals;

