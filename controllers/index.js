/**
 * The default controller for the application.
 */
var express         = require('express'),
    session         = require('express-session'),
    router          = express.Router();

router.use('/accounts', require('./accounts'));
app.get('/home', function(request, response) {
    var sess = request.session;

    console.log('[DEBUG] Get /home');

    if( sess.username ) {
        console.log('[DEBUG] found username in session: ' + sess.username);
        response.redirect('/profile');
    } else {
        console.log('[DEBUG] Cannot find username in session redirecting to index.html');
    }

    response.render('misc/home.html');
});

module.exports = router;
