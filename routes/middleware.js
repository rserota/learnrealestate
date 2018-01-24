var gar = global.appRoot
var User = require(`${gar}/models/user`)


var checkIfLoggedIn = function(req, res, next){
    next()
}

var whoIsLoggedIn = function(req, res, next){
    if ( !req.session.uid ) {
        req.user = null 
        next()
    }
    else if ( req.session.uid ) {
        User.findOne({_id:req.session.uid}).then(function(data){
            if (data) { req.user = data }
            else { req.user = null }
            next()
        }).catch(function(err){
            console.log('err ', err)
            next(err)
        })
    }
}

module.exports = {
    checkIfLoggedIn : checkIfLoggedIn,
    whoIsLoggedIn   : whoIsLoggedIn,
}
