var fs = require('fs')
var definitionModel = require('../models/definition')
var mongoose = require('mongoose')


mongoose.connect('mongodb://localhost/realestestate', function(mongooseErr) {
    if( mongooseErr ) {
	console.error(mongooseErr);
    } 
    else {
	console.info('Mongoose initialized!');
    }
})

// get all the definitions from the database
definitionModel.find().exec().then(function(definitions){
        
    fs.readdir('./views/lessons', function(err, items) {
        //console.log(items);
     
        for (var i=0; i<items.length; i++) {
            if ( items[i].match(/lesson-\d/) ){
                //console.log(items[i]);
                var lessonOverview = fs.readFileSync(`./views/lessons/lesson-sources/${items[i]}`, 'utf-8')
                
                for ( var j = 0; j < definitions.length; j++ ) {
                    //console.log('=-=-=-=-=-=-=')
                    //console.log('def name', definitions[j].definitionName)
                    lessonOverview = lessonOverview.replace(new RegExp('(\\s|>)' + definitions[j].definitionName.trim() + 's?', 'gi'), function(match){
                        //console.log('match? ', match)
                        return ` <span data-tooltip="${definitions[j].definitionTag}">${match}</span>`
                    })
                }
                //console.log(lessonOverview)

                fs.writeFileSync(`./views/lessons/${items[i]}`, lessonOverview)
            }
        }
        process.exit(0)
    });


        
       
})
