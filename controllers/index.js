/**
 * The default controller for the application.
 */
var express = require('express'),
    router  = express.Router();

router.use('/accounts', require('./accounts'));


router.get('/', function(request, response)
{

  console.log("[DEBUG] Cookies: ", request.cookies);

  if(request.cookies.remember)
  {
    console.log("[DEBUG] Found a cookie!");
    response.render('accounts/profile.html')
  }
  else {
    console.log("[DEBUG] No cookie found");
    response.render('index.html');
  }

});

module.exports = router;
