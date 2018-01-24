var gar = global.appRoot
var express = require('express')
var nullPass = require(`${gar}/utils/nullPass`)
var kebab2pretty = require(`${gar}/utils/kebab2pretty`)
var setStreak = require(`${gar}/utils/setStreak`)

var router = express.Router()
//console.log('gar ', gar)
var Question = require(`${gar}/models/question`)
var Definition = require(`${gar}/models/definition`)
var PastAnswer = require(`${gar}/models/pastAnswers`)
var middleware = require(`${gar}/routes/middleware`)

router.get('/:sectionName/lesson-list', middleware.whoIsLoggedIn, function(req, res){
    
    res.render(`lessons/lesson-lists/${req.params.sectionName}-list`, {
        title : "The Realest Estate",
        user: nullPass(req.user)
    })
})


router.get('/lessons/:lessonNumber/overview', middleware.whoIsLoggedIn, function(req, res, next){
    Question.find({lessonNumber:req.params.lessonNumber}, function(err, data){
        if (err){return next(err)}
        if (req.user){
            var totalCorrectInThisLesson = 0
            for (var i = 0; i < data.length; i++){
                if (data[i]._id in req.user.pastAnswers) {
                    totalCorrectInThisLesson++
                }
            }

            var progressPercent = (totalCorrectInThisLesson / data.length) * 100
            req.user.lessonMastery[req.params.lessonNumber] = progressPercent
            req.user.update({$set:{lessonMastery:req.user.lessonMastery}}, function(err, doc){
                console.log('lessonRoutes33 err? ', err)
            })
        }

        try {
            var lessonListUrl = `/${data[0].section.toLowerCase().replace(/ /g, '-')}/lesson-list`
        }
        catch(e){
            return res.render('404')
        }
        // find all the definitions, or just the ones for this lesson?
        Definition.find({}, function(err, defs){
            if (err){return next(err)} 
            res.render(`lessons/lesson-${req.params.lessonNumber}`, {
                user: nullPass(req.user),
                progress: progressPercent,
                quizUrl: `/lessons/${req.params.lessonNumber}/learn`,
                crosswordUrl: `/lessons/${req.params.lessonNumber}/crossword`,
                lessonListUrl: lessonListUrl,
                section: data[0].section,
                definitions: defs,
            })

        })
    })
})

router.get('/lessons/:lessonNumber/learn', middleware.whoIsLoggedIn, function(req, res){
    
    Question.find({lessonNumber: req.params.lessonNumber}, function(err, data){
        if (err){console.log(err); return next(err)}
        //console.log('question data? ', data)
        Definition.find({lessonNumber: req.params.lessonNumber}, function(err, defs){
            res.render(`lessons/lesson-quiz`, {
                user: nullPass(req.user),
                lessonName: data[0].lessonName,
                questions : data,
                definitions: defs
            })
        })
    })
})

router.get('/lessons/:lessonName/contract', middleware.whoIsLoggedIn, function(req, res){
    res.render('lessons/contract-test', {
        user: nullPass(req.user),
        lessonName:req.params.lessonName
    })    
})

router.get('/lessons/:lessonNumber/crossword', middleware.whoIsLoggedIn, function(req, res){
    console.log('lessonNumber? ', req.params.lessonNumber)
    Definition.find({lessonNumber: req.params.lessonNumber}, function(err, data){
        if (err){console.log(err); return next(err)}
        console.log('definition data? ', data)
        res.render('lessons/crossword', {
            user: nullPass(req.user),
            lessonNumber:req.params.lessonNumber,
            lessonName: data[0].lessonName,
            definitions : data
        })
    })
})

router.post('/past-answers', middleware.whoIsLoggedIn, function(req, res){
    setStreak(req.user)
    console.log('req user', req.user)
    console.log('req body user', req.body.user)
    req.user.update(
        {
            $set  : {pastAnswers:req.body.user.pastAnswers, currentDayStreak: req.user.currentDayStreak},
            $push : {pastLessonDates:new Date()},
        }, 
        function(err, doc){
            console.log('err? ', err)
            console.log('doc? ', doc)
            res.send('got it!')
        }
    )
})

module.exports = router
