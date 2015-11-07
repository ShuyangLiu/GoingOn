var express     = require('express'),
    router      = express.Router(),
    User        = require('../models/User'),
    UserGroup   = require('../models/UserGroup');

router.get('/signUp', function(request, response) {
    var forwardUrl  = request.query.forwardUrl || '/';

    response.render('accounts/signup.html', {
        'forwardUrl': forwardUrl
    });
});
router.get('/signUp.action', function(request, response) {
    var username            = request.query.username,
        password            = request.query.password,
        email               = request.query.email,
        gender              = request.query.gender,
        organizationType    = request.query.organizationType,
        userGroupSlug       = request.query.userGroup,
        result              = {
            'isSuccessful': false,
            'isUsernameEmpty': !username,
            'isUsernameLegal': isUsernameLegal(username),
            'isUsernameExists': false,
            'isPasswordEmpty': !password,
            'isPasswordLegal': isPasswordLegal(password),
            'isEmailEmpty': !email,
            'isEmailLegal': isEmailLegal(email),
            'isEmailExists': false,
            'isGenderEmpty': !gender,
            'isGenderLegal': isGenderLegal(gender),
            'isOrganizationTypeEmpty': !organizationType,
            'isOrganizationTypeLegal': isOrganizationTypeLegal(organizationType),
            'isUserGroupLegal': false
        };
    result['isSuccessful']  = !result['isUsernameEmpty'] && result['isUsernameLegal'] &&
                              !result['isPasswordEmpty'] && result['isPasswordLegal'] &&
                              !result['isEmailEmpty']    && result['isEmailLegal'];

    console.log("[DEBUG] username", username);
    // Check if UserGroup is exists
    UserGroup.getUserGroupUsingSlug(userGroupSlug, function(userGroup) {
        if ( !userGroup || userGroup['userGroupSlug'] == 'administrator' ) {
            result['isUserGroupLegal'] = false;
        }

        // Check if Username is exists
        User.getUserUsingUsername(username, function(user) {
            if ( user ) {
                result['isUsernameExists'] = true;
            }

            // Check if Email is exists
            User.getUserUsingEmail(email, function(user) {
                if ( user ) {
                    result['isEmailExists'] = true;
                }

                result['isSuccessful'] &= result['isUserGroupLegal'] && !result['isUsernameExists'] && 
                                         !result['isEmailExists'];
                if ( userGroup && userGroup['userGroupSlug'] == 'personal' ) {
                    result['isSuccessful'] &= !result['isGenderEmpty'] && result['isGenderLegal'];
                } else if ( userGroup && userGroup['userGroupSlug'] == 'organzation' ) {
                    result['isSuccessful'] &= !result['isOrganizationTypeEmpty'] && 
                                               result['isOrganizationTypeLegal'];
                }
            });

            if ( result['isSuccessful'] ) {
                var user        = {
                    'username': username,
                    'password': password,
                    'email': email,
                    'gender': gender,
                    'organizationType': organizationType,
                    'userGroupId': userGroup['userGroupId']
                };

                User.createUser(user, function() { });
            }
            response.json(result);
        });
    });
});

router.get('/signIn', function(request, response) {
    var isLogout    = request.query.isLogout || false,
        forwardUrl  = request.query.forwardUrl || '/';

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

function isUsernameLegal(username) {
    return false;
}

function isPasswordLegal(password) {
    return false;
}

function isEmailLegal(email) {
    return true;
}

function isGenderLegal(gender) {
    return false;
}

function isOrganizationTypeLegal(organizationType) {
    return true;
}