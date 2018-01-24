var express = require('express')
var router = express.Router()
var gar = global.appRoot
var middleware = require(`${gar}/routes/middleware`)
var User = require(`${gar}/models/user`)
var bcrypt = require('bcryptjs')
var nullPass = require(`${gar}/utils/nullPass`)
var getStreak = require(`${gar}/utils/getStreak`)


router.post('/login', function(req, res, next) { // form post submission
    console.info('auth.login.payload:', req.body);
    
    User.findOne({ email: req.body.email }, function(err, user) {
        
        if( err) {
            console.log('MongoDB error:'.red, err);
            res.status(500).send("failed to find user")
        }
        else if( !user ) {
            console.log('No user found!');
            res.status(403).send("No user found");
        } 
        else if ( !user.password ) { 
            return next(new Error('use has no password')) 
        }
        else {
            console.log('auth.login.user', user);
            bcrypt.compare(req.body.password, user.password, function(bcryptErr, matched) {
                if( bcryptErr ) {
                    console.error('MongoDB error:', bcryptErr);
                    res.status(500).send("mongodb error");
                } else if ( !matched ) {
                    console.warn('Password did not match!');
                    res.status(403).send("failed to log in");
                } else {
                    req.session.uid = user._id; // this is what keeps our user session on the backend!
                    var streakMessage = getStreak(user)
                    res.send({ 
                        user: nullPass(user),
                        status : 'success',
                        streakMessage:streakMessage,
                    }); // send a success message
                }
            });
        }
    });
});

router.get('/logout', function(req, res) {
    req.session.reset(); // clears the users cookie session
    res.redirect('/');
});    

router.get('/dashboard.html', middleware.checkIfLoggedIn, function(req, res){
    res.send('the home page')
});

module.exports = router
