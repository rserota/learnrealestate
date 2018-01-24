var express = require('express')
var gar = global.appRoot
var app = require(`${gar}/server.js`)

app.use(function(req, res){
    res.status(404).render('404')
})

app.use(function(err, req, res, next){
    console.log('error! ', err)
    res.send(err.toString())
})

