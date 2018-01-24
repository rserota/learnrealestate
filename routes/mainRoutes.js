var gar = global.appRoot
var express = require('express')
var nullPass = require(`${gar}/utils/nullPass`)
var kebab2pretty = require(`${gar}/utils/kebab2pretty`)
var router = express.Router()
var getStreak = require(`${gar}/utils/getStreak`)
//console.log('gar ', gar)
var middleware = require(`${gar}/routes/middleware`)



router.get('/', middleware.whoIsLoggedIn, function(req, res) {
    //console.log('user? ', req.user)
    if ( req.user ) {
        res.render('index', {
            title : 'Learn Real Estate',
            user : nullPass(req.user),
            sectionTotals: global.sectionTotals
        })
    }
    else {
        res.render('index', {
            title: 'Learn Real Estate',
            user: null,
        })
    }
})


router.get('/contact-sales', function(req, res) {
    res.send('buy stuff!')
})

module.exports = router
