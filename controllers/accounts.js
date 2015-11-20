var express     = require('express'),
    router      = express.Router(),
    md5         = require('md5'),
    User        = require('../models/User'),
    UserGroup   = require('../models/UserGroup');

router.get('/signUp', function(request, response) {
    var forwardUrl  = request.query.forwardUrl || '/';

    response.render('accounts/signup.html', {
        'forwardUrl': forwardUrl
    });
});
router.post('/signUp.action', function(request, response) {
    var username            = request.body.username,
        password            = request.body.password,
        email               = request.body.email,
        gender              = request.body.gender,
        organizationType    = request.body.organizationType,
        userGroupSlug       = request.body.userGroup,
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

    if ( result['isSuccessful'] ) {
        var userGroup              = getUserGroupUsingSlug(userGroupSlug);
        result['isUsernameExists'] = isUsernameExists(username);
        result['isEmailExists']    = isEmailExists(email);
        result['isUserGroupLegal'] = isUserGroupLegal(userGroup);

        result['isSuccessful']    &= result['isUserGroupLegal'] && !result['isUsernameExists'] &&
                                    !result['isEmailExists'];
        if ( userGroup && userGroup['userGroupSlug'] == 'personal' ) {
            result['isSuccessful'] &= !result['isGenderEmpty'] && result['isGenderLegal'];
        } else if ( userGroup && userGroup['userGroupSlug'] == 'organzation' ) {
            result['isSuccessful'] &= !result['isOrganizationTypeEmpty'] &&
                                       result['isOrganizationTypeLegal'];
        }
        if ( result['isSuccessful'] ) {
            var user        = {
                'username': username,
                'password': md5(password),
                'email': email,
                'gender': gender,
                'organizationType': organizationType,
                'userGroupId': userGroup['userGroupId']
            };

            var createdUser = User.createUser(user);
            console.log("[INFO] An user is created at %s.", request.ip, createdUser);
        }
    }
    response.json(result);
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
        rememberMe          = request.body.rememberMe,
        result              = {
            'isSuccessful': false,
            'isUsernameEmpty': !username,
            'isPasswordEmpty': !password,
            'isAccountValid': false,
        };

    var user = User.getUserUsingUsername(username);

    if ( user && user.password == password )
    {
        result['isSuccessful'] = true;
        result['isAccountValid'] = true;

        if(rememberMe)
        {
          //TODO:send a cookie here
          var minute = 60 * 100000;
          response.cookie('remember', 1, { maxAge: minute });
        }

    }
    response.json(result);
});

module.exports = router;

function isUsernameLegal(username) {
    return username.match(/^[A-Za-z][A-Za-z0-9_]{5,15}$/g) != null;
}

function isUsernameExists(username) {
    var user = User.getUserUsingUsername(username);
    if ( user ) {
        return true;
    }
    return false;
}

function isPasswordLegal(password) {
    var passwordLength = password.length;
    return passwordLength >= 6 && passwordLength <= 16;
}

function isEmailLegal(email) {
    var emailLength = email.length;
    return emailLength <= 64 &&
           email.match(/^[A-Za-z0-9\._-]+@[A-Za-z0-9_-]+\.[A-Za-z0-9\._-]+$/) != null;
}

function isEmailExists(email) {
    var user = User.getUserUsingEmail(email);
    if ( user ) {
        return true;
    }
    return false;
}

function getUserGroupUsingSlug(userGroupSlug) {
    var userGroup = UserGroup.getUserGroupUsingSlug(userGroupSlug);
    if ( userGroup && userGroup['userGroupSlug'] != 'administrator' ) {
        return userGroup;
    }
    return null;
}

function isUserGroupLegal(userGroup) {
    if ( userGroup && userGroup['userGroupSlug'] != 'administrator' ) {
        return true;
    }
    return false;
}

function isGenderLegal(gender) {
    var genderOptions = ['Male', 'Female'];
    return genderOptions.indexOf(gender) != -1;
}

function isOrganizationTypeLegal(organizationType) {
    var organizationTypeOptions = ['Class Counsil','Engineering','Art and Music','Cultural'];
    return organizationTypeOptions.indexOf(organizationType) != -1;
}
