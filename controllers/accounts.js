var express     = require('express'),
    router      = express.Router(),
    User        = require('../models/User'),
    UserGroup   = require('../models/UserGroup');

router.get('/signUp', function(request, response) {
    response.render('accounts/signup.html');
});
router.get('/signUp.action', function(request, response) {
    var username            = request.body.username,
        password            = request.body.password,
        email               = request.body.email,
        gender              = request.body.gender,
        organizationType    = request.body.organizationType,
        userGroupSlug       = request.body.userGroup;

    response.json(null);
});

router.get('/signIn', function(request, response) {
    var isLogout    = request.params.isLogout || false,
        forwardUrl  = request.params.query || '/';

    response.render('accounts/signin.html', {
        'isLogout': isLogout,
        'forwardUrl': forwardUrl
    });
});
router.post('/signIn.action', function(request, response) {
    var username            = request.body.username,
        password            = request.body.password,
        result              = {
            'isSuccessful': false,
            'isUsernameEmpty': !username,
            'isPasswordEmpty': !password,
            'isAccountValid': false,
        };

    User.getUserUsingUsername(username, function(user) {
        if ( user && user.password == password ) {
            result['isSuccessful'] = true;
            result['isAccountValid'] = true;
        }
        response.json(result);
    });
});

module.exports = router;