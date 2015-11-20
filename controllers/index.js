/**
 * The default controller for the application.
 */
var express = require('express'),
    cookieParser = require('cookie-parser'),
    router  = express.Router();

var session = require('express-session');
var sess;

router.use('/accounts', require('./accounts'));

router.get('/', function(request, response)
{
  sess=request.session;

  console.log('[DEBUG] Get /');

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

module.exports = router;
