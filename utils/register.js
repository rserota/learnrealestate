
require('../models/db')
var User = require('../models/user')
var bcrypt = require('bcryptjs')

var newUser = new User({email:process.argv[2], password:process.argv[3]})

bcrypt.genSalt(10, function(saltErr, salt) { // used to guarentee uniqueness
    if(saltErr) { console.log(saltErr); }

    bcrypt.hash(newUser.password, salt, function(hashErr, hashedPassword) {
        if( hashErr ) { console.log(hashErr); }
        newUser.password = hashedPassword;
        newUser.save(function(err){ 
            console.log('err? ', err) 
            process.exit(0)
        })

    });
})

