var express     = require('express'),
    router      = express.Router(),
    md5         = require('md5'),
    session     = require('express-session'),
    Activity    = require('../models/Activity'),
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

    console.log('[DEBUG]request.body.organizationType: '+request.body.organizationType);

    result['isSuccessful']  = !result['isUsernameEmpty'] && result['isUsernameLegal'] &&
                              !result['isPasswordEmpty'] && result['isPasswordLegal'] &&
                              !result['isEmailEmpty']    && result['isEmailLegal'];

    if ( result['isSuccessful'] )
    {
        var userGroup              = getUserGroupUsingSlug(userGroupSlug);
        result['isUsernameExists'] = isUsernameExists(username);
        result['isEmailExists']    = isEmailExists(email);
        result['isUserGroupLegal'] = isUserGroupLegal(userGroup);

        result['isSuccessful']    &= result['isUserGroupLegal'] &&
                                    !result['isUsernameExists'] &&
                                    !result['isEmailExists'];

        if ( userGroup && userGroup['userGroupSlug'] == 'personal' )
        {
          result['isSuccessful'] &= !result['isGenderEmpty'] &&
                                     result['isGenderLegal'];
        }
        else if ( userGroup && userGroup['userGroupSlug'] == 'organization' )
        {
          result['isSuccessful'] &= !result['isOrganizationTypeEmpty'] &&
                                     result['isOrganizationTypeLegal'];
        }
        else
        {
          result['isSuccessful'] = false;
        }

        if ( result['isSuccessful'] )
        {
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

    var sess = request.session;

    if( sess.username || request.cookies.remember) //If already logged in
    {
            console.log('[DEBUG] found username in session: ' + sess.username);
            response.redirect('/accounts/profile');
    }
    else
    {
      response.render('accounts/signin.html', {
          'isLogout': isLogout,
          'forwardUrl': forwardUrl
      });
    }
});


router.post('/signIn.action', function(request, response) {
    var username            = request.body.username,
        password            = request.body.password,
        rememberMe          = request.body.rememberMe,
        result              = {
            'isSuccessful'    : false,
            'isUsernameEmpty' : !username,
            'isPasswordEmpty' : !password,
            'isAccountValid'  : false,
            'user_group_id'   : 0
        };

    var user = User.getUserUsingUsername(username);
    if ( user && user.password == password ) {
        result['isSuccessful']    = true;
        result['isAccountValid']  = true;
        result['user_group_id']   = user.userGroupId;
        console.log('[DEBUG]user_group_id: '+result['user_group_id']);
        var minute = 60*100000;
        if(rememberMe)
        {
            var sess = request.session;
            sess.username = request.body.username;
            console.log('[DEBUG]Session.username: '+sess.username);
            response.cookie('remember', user.email, { maxAge: minute });
        }
    }
    response.json(result);
});

router.get('/profile',function(request,response){
    var sess = request.session;
    console.log('[DEBUG] get a profile request');
    if(sess.username || request.cookies.remember)
    {
        console.log('[DEBUG] from profile:Session.username: '+sess.username);
        var user = User.getUserUsingUsername(sess.username);
        if(user.userGroupId == 1){
           var allActivities = Activity.getAllActivities();
           console.log('[DEBUG] all activities: '+allActivities);
          response.render('accounts/profile.html',{'activities':allActivities});
        }else if(user.userGroupId == 2){
          response.render('accounts/group_home.html');
        }
        else {
          response.redirect('/home');
        }
    } else {
        response.redirect('/home');
    }

  });

router.get('/posted_event',function(request,response){
  var sess = request.session;
  if(sess.username || request.cookies.remember)
  {
    var posted_event = Activity.getPostedActivities(sess.username);
    response.render('accounts/posted_event.html',{activities:posted_event});
  } else {
    response.redirect('/home');
  }
});

router.get('/logout',function(request,response){
    console.log('[DEBUG] get a logout request!');
    response.clearCookie('remember');
    request.session.destroy(function(err) {
        if( err )
        {
            console.log("[ERROR]" + err);
        } else {
            response.redirect('/home');
        }
    });
});

router.get('/update',function(request,response){
    console.log('[DEBUG] get a update request!');
    var sess = request.session;
    //MUST logged in to update the user information
    if(sess.username || request.cookies.remember)
    {
        console.log('[DEBUG] from update:Session.username: '+sess.username);
        response.render('accounts/update.html');
    }
    else
    {
        response.redirect('/home');
    }
});

router.post('/NewEvent',function(request,response){
  var sess = request.session;
  console.log('[DEBUG] POST: enter NewEvent');
  var activity_name         = request.body.activity_name;
  var activity_type         = request.body.activity_type;
  var activity_time         = request.body.activity_time;
  var activity_location     = request.body.activity_location;
  var activity_description  = request.body.activity_description;

  var result = {
    'isSuccessful'                : false,
    'isActivityNameEmpty'         : !activity_name,
    'isActivityTypeEmpty'         : !activity_type,
    'isActivityTimeEmpty'         : !activity_time,
    'isActivityLocationEmpty'     : !activity_location,
    'isActivityDescriptionEmpty'  : !activity_description
  };

  result['isSuccessful'] = !result['isActivityDescriptionEmpty']&&
                           !result['isActivityLocationEmpty']   &&
                           !result['isActivityTimeEmpty']       &&
                           !result['isActivityTypeEmpty']       &&
                           !result['isActivityNameEmpty'];

  if(result['isSuccessful'])
  {
    var NewEvent = {
      'activity_name' : activity_name,
      'activity_type' : activity_type,
      'activity_time' : activity_time,
      'activity_location' : activity_location,
      'activity_description' : activity_description,
      'activity_group' : sess.username
    };

    var new_event = Activity.createNewEvent(NewEvent);

    console.log("[INFO] An event is inserted at %s.", request.ip, new_event);
  }

  response.json(result);

});

router.get('/about',function(request,response){
  console.log('[DEBUG] get a about request!');
  var sess = request.session;
  //MUST logged in to see the about page
  if(sess.username || request.cookies.remember)
  {
    var user = User.getUserUsingUsername(sess.username);
    if (user.userGroupId == 2) {
      response.render('accounts/about.html',{'posted_event_link':'Posted Event'});
    } else {
      response.render('accounts/about.html',{'posted_event_link':'NULL'});
    }
      console.log('[DEBUG] from about:Session.username: '+sess.username);
  }
  else
  {
      response.redirect('/home');
  }
});

router.post('/update.action',function(request,response){
      console.log('[DEBUG] POST: enter update');
      var sess = request.session;
      var username = request.body.username;
      var password = request.body.password;
      var gender   = request.body.gender;

      var result       = {
          'isSuccessful'    : false,
          'isUsernameEmpty' : !username,
          'isUsernameExists': false,
          'isUsernameLegal' : isUsernameLegal(username),
          'isPasswordEmpty' : !password,
          'isPasswordLegal' : isPasswordLegal(password),
          'isGenderEmpty'   : !gender,
          'isGenderLegal'   : isGenderLegal(gender),
      };

      result['isUsernameExists'] = isUsernameExists(username);

      result['isSuccessful'] = !result['isUsernameEmpty'] &&
                                result['isUsernameLegal'] &&
                               !result['isUsernameExists']&&
                               !result['isPasswordEmpty'] &&
                                result['isPasswordLegal'] &&
                               !result['isGenderEmpty']   &&
                                result['isGenderLegal'];

      if(result['isSuccessful'])
      {
        var user;
        if(request.cookies.remember)
        {
            user        = {
              'username': username,
              'password': md5(password),
              'email'   : request.cookies.remember,
              'gender'  : gender,
          };
        }
        else {
          var old_user = User.getUserUsingUsername(sess.username);
          user        = {
            'username': username,
            'password': md5(password),
            'email'   : old_user.email,
            'gender'  : gender,
          };
        }

        var updatedUser = User.updateUser(user);
        sess.username = username;
        console.log("[INFO] An user is updated at %s.", request.ip, updatedUser);
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

function isGenderLegal(gender)
{
    var genderOptions = ['Male', 'Female'];
    return genderOptions.indexOf(gender) != -1;
}

function isOrganizationTypeLegal(organizationType)
{
    var organizationTypeOptions = ['Class Council','Engineering','Art and Music','Cultural'];
    return organizationTypeOptions.indexOf(organizationType) != -1;
}
