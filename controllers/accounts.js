var express = require('express'),
    router  = express.Router();

router.get('/signUp', function(request, response) {
    response.render('accounts/signup.html');
});

module.exports = router;