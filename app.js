var config          = require('./config'),
    bodyParser      = require('body-parser'),
    express         = require('express'),
    globalFiber     = require('fibers'),
    methodOverride  = require('method-override'),
    mysql           = require('mysql'),
    path            = require('path'),
<<<<<<< HEAD
    cookieParser    = require('cookie-parser'),
=======
>>>>>>> bcad49bc468c153221a7193a9f3a65e9be630b78
    session         = require('express-session');

app                 = express();
var http            = require('http').Server(app);


/**
 * Database Connection for the application.
 */
connection = mysql.createPool({
        connectionLimit: config.database.connectionLimit,
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    });
connection.getConnection(function(error, connection) {
    if ( !error ) {
        console.log('[DEBUG] %s Database is connected #%s', getTimeNow(), connection.threadId);
    } else {
        console.log('[DEBUG] %s Error connecting database...', getTimeNow());
    }
});

/**
 * Set up Application.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'GoingOnSessionSecret'
}));

app.engine('html', require('ejs').renderFile);
app.use('/assets', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

/**
 * Handlers for the application.
 */
//app.use(require('./controllers'));
app.use('/accounts', require('./controllers/accounts'));

app.get('/home',function(request,response){
  sess=request.session;
  console.log('[DEBUG] Get a /home request');
  if(sess.username)
  {
    console.log('[DEBUG] found username in session: '+sess.username);
    response.redirect('/profile');
  }
  else
  {
    console.log('[DEBUG] Cannot find username in session redirecting to index.html');
    response.render('index.html');
  }

});

app.get('/profile',function(request,response){
    console.log('[DEBUG] get a profile request');
    sess=request.session;
    if(sess.username)
    {
      console.log('[DEBUG] from profile:Session.username: '+sess.username);
      response.render('accounts/profile.html');
      // response.write('<h1>Hello '+sess.username+'</h1>');
      // response.end('<a href="/logout">Logout</a>');
    }
    else
    {
      response.redirect('/home');
      // response.write('<h1>Please login first.</h1>');
      // response.end('<a href="+">Login</a>');
    }

  });

app.get('/logout',function(request,response){

    console.log('[DEBUG] get a logout request!');
    request.session.destroy(function(err){
    if(err)
    {
      console.log(err);
    }
    else
    {
      response.redirect('/home');
    }
  });
});


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

/**
 * Get current time stamp.
 * This function mainly used to generate logs.
 */
function getTimeNow() {
    var currentdate = new Date();
    var datetime    = currentdate.getFullYear() + '/' +
                      (currentdate.getMonth() + 1)  + '/' +
                      currentdate.getDate() + ' ' +
                      currentdate.getHours() + ':' +
                      currentdate.getMinutes() + ':' +
                      currentdate.getSeconds();
    return datetime;
}
