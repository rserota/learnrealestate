var csv = require('csv')
var fs = require('fs')
var definitionModel = require('../models/definition')
var mongoose = require('mongoose')


mongoose.connect('mongodb://localhost/realestestate', function(mongooseErr) {
    if( mongooseErr ) {
	console.error('mongoose error: ', mongooseErr);
    } 
    else {
	console.info('Mongoose initialized!');
    }
})

var lesson1DefinitionsCsv = fs.readFileSync('./models/csvs/definitions.tsv', 'utf-8')
console.log('defs? ', lesson1DefinitionsCsv)
var glossaryTerms = {
    'real estate' : new RegExp('real estate','i')
}
var cowsOut = 1
csv.parse(lesson1DefinitionsCsv,{delimiter:'\t', quote: '`'}, function(err, data){
   
    console.log('err? ', err)
    cowsOut = data.length

    // For each question ...
    for ( var i = 0; i < data.length; i++ ) {
        console.log(data[i])

        var newDefinition = new definitionModel({
            definitionName: data[i][0],
            definitionTag: data[i][1],
            definition: data[i][2],
            lessonNumber: data[i][3],
            lessonName: data[i][4],
        })
        newDefinition.save(function(saveErr, insertData){
            console.log('insert err? ', saveErr)
            cowsOut--
        })
    }

})

setInterval(function(){
    if ( !cowsOut ){
        process.exit(0)
    }
},100)

