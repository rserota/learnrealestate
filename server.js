var express        = require('express')
var bodyParser     = require('body-parser')
var path           = require('path')
var sessionsModule = require('client-sessions')
var app = module.exports = express()

app.locals.basedir = __dirname;
var gar = global.appRoot = app.locals.basedir
var db             = require('./models/db')


// lets figure this out when the server starts, because it won't change dynamically
var sectionTotalModel = require(`${gar}/models/sectionTotals`)
sectionTotalModel.findOne({}, function(err, doc){
    if (err) { console.log('err line13: ', err)}
    console.log('doc??', doc)
    global.sectionTotals = doc
})
app.set('views', __dirname + '/views');
app.set('view engine', 'pug')


var sessionMiddleware = sessionsModule({
    cookieName: 'auth-cookie',  // front-end cookie name
    secret: 'DR@G0N$',        // the encryption password : keep this safe
    requestKey: 'session',    // req.session,
    duration: (86400 * 1000) * 7, // one week in milliseconds
    cookie: {
        ephemeral: false,     // when true, cookie expires when browser is closed
        httpOnly: true,       // when true, the cookie is not accesbile via front-end JavaScript
        secure: false         // when true, cookie will only be read when sent over HTTPS
    }
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('./public'))
app.use(sessionMiddleware)

app.use(require('./routes/mainRoutes'))
app.use(require('./routes/authRoutes'))
app.use(require('./routes/lessonRoutes'))
require('./routes/errorRoutes')

var port = process.env.PORT || 8080
app.listen(port, function(err){
    if ( err ) { console.log(err) }
})
