var csv = require('csv')
var fs = require('fs')
var questionModel = require('../models/question')
var definitionModel = require('../models/definition')
var sectionTotalsModel = require('../models/sectionTotals')
var mongoose = require('mongoose')


mongoose.connect('mongodb://localhost/realestestate', function(mongooseErr) {
    if( mongooseErr ) {
	console.error(mongooseErr);
    } 
    else {
	console.info('Mongoose initialized!');
    }
})

// this should be a concatenated file with ALL the questions
var lessonQuestionsCsv = fs.readFileSync('./models/csvs/questions.tsv', 'utf-8')

var cowsOut = 1
// get all the questions from the CSV
csv.parse(lessonQuestionsCsv, {delimiter: '\t', quote: '`'}, function(err, data){
    console.log('err? ', err)
    cowsOut = data.length
    // get all the definitions from the database
    definitionModel.find().exec().then(function(definitions){

        // need to figure out total number of questions in each section
        // for each question ...
        var sectionTotals = {total: data.length}
        for ( var i = 0; i < data.length; i++ ) {
            if ( sectionTotals[data[i][4]] ) {
                sectionTotals[data[i][4]]++
            }
            else {
                sectionTotals[data[i][4]] = 1
            }
        }
        var theSectionTotals = new sectionTotalsModel(sectionTotals)
        theSectionTotals.save(function(err){if (err){console.log('err line40: ', err)}})
         // For each question ...
        for ( var i = 0; i < data.length; i++ ) {
            var taggedRationale = data[i][5]
            // check the rationale for each glossary term.

            for ( var j = 0; j < definitions.length; j++ ) {
                //console.log('=-=-=-=-=-=-=')
                //console.log('def name', definitions[j].definitionName)

                taggedRationale = taggedRationale.replace(new RegExp('\\b' + definitions[j].definitionName.trim() + 's?', 'gi'), function(match){
                    return `<span data-tooltip="${definitions[j].definitionTag}">${match}</span>`
                })
            }

            var newQuestion = new questionModel({
                question: data[i][0],
                lessonNumber: data[i][2],
                lessonName: data[i][3],
                section: data[i][4],
                rationale: taggedRationale,
                answers: [
                    {
                       text: data[i][6],
                       correct: true
                    },
                    {
                       text: data[i][7],
                       correct: false
                    },
                    {
                       text: data[i][8],
                       correct: false
                    },
                    {
                       text: data[i][9],
                       correct: false
                    },
                ]
            })
            newQuestion.save(function(saveErr, insertData){
                console.log('insert err? ', saveErr)
                cowsOut--
            })
        }

           
    })
})

setInterval(function(){
    if ( !cowsOut ){
        process.exit(0)
    }
},100)

