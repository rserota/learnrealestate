var mongoose = require('mongoose')
mongoose.Promise = global.Promise


mongoose.connect('mongodb://localhost/realestestate', function(mongooseErr) {
    if( mongooseErr ) {
	console.error(mongooseErr);
    } 
    else {
	console.info('Mongoose initialized!');

    }
})
