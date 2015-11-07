/**
 * The default controller for the application.
 */
var express = require('express'),
    router  = express.Router();

router.use('/accounts', require('./accounts'));

router.get('/', function(request, response) {
    response.render('index.html');
});

module.exports = router;