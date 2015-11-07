var config          = require('./config'),
    bodyParser      = require('body-parser'),
    express         = require('express'),
    methodOverride  = require('method-override'),
    mysql           = require('mysql'),
    path            = require('path'),
    session         = require('express-session');

var app             = express();
    http            = require('http').Server(app);

/**
 * Set up Application.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true 
}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'GoingOnSessionSecret'
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

console.log("[DEBUG] __dirname = ", __dirname);

app.set('views', path.join(__dirname, '/views'));

app.use('/assets', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

/**
 * Get current time stamp.
 * This function mainly used to generate logs.
 */
function getTimeNow() {
    var currentdate = new Date(); 
    var datetime    = currentdate.getFullYear() + '/'  
                    + (currentdate.getMonth() + 1)  + '/' 
                    + currentdate.getDate() + ' '
                    + currentdate.getHours() + ':'  
                    + currentdate.getMinutes() + ':' 
                    + currentdate.getSeconds();
    return datetime;
}

/**
 * Database Connection for the application.
 */
var connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});
connection.connect(function(err) {
    if ( !err ) {
        console.log('[DEBUG] %s Database is connected...', getTimeNow());
    } else {
        console.log('[DEBUG] %s Error connecting database...', getTimeNow());
    }
});

/**
 * Handlers for the application.
 */
app.use(require('./controllers'));

/**
 * Error handler for the application.
 */
app.use(function(error, request, response, next){
    if ( !module.parent ) {
        console.error('[ERROR] %s', getTimeNow());
        console.error(error.stack);
    }
    response.status(500).render('errors/5xx.html');
});

app.use(function(request, response, next){
    response.status(404).render('errors/404.html');
});

/**
 * The bootstrap of the application.
 */
var server = http.listen(config.server.port, function(){
    var host = server.address().address,
        port = server.address().port;
    console.log('[DEBUG] %s Application is listening at http://%s:%s', getTimeNow(), host, port);
});
