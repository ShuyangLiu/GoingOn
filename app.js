var mysql = require('mysql');
var express = require('express');

var app = express();
var http = require('http').Server(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true 
}));

// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

// app.set('views', './views');

// app.set('view engine', 'jade');

// app.get('/', function (req, res) {
//   res.render('index', { title: 'Hey', message: 'Hello there!'});
// });

app.use(express.static('views'));

var config = require('./config');
var connection = mysql.createConnection({
    host     : config.database.host,
    user     : config.database.user,
    password : config.database.password,
    database : config.database.database
});
connection.connect(function(err){
    if ( !err ) {
        console.log("[DEBUG] Database is connected...");
    } else {
        console.log("[DEBUG] Error connecting database...");
    }
});


// app.post('/login', passport.authenticate('local-login', {
//            successRedirect : '/profile', // redirect to the secure profile section
//            failureRedirect : '/login', // redirect back to the signup page if there is an error
//            failureFlash : true // allow flash messages
// 	}),
//        function(req, res) {
//            console.log("hello");
//
//            if (req.body.remember) {
//              req.session.cookie.maxAge = 1000 * 60 * 3;
//            } else {
//              req.session.cookie.expires = false;
//            }
//        res.redirect('/');
//    });

app.post("/",function(req,res)
{
    var body = req.body;
    var username = body.username;
    var password = body.password;
    var email = body.email;
    var accountType = body.account_type;

    if ( accountType == "individual" ) {
        console.log("[DEBUG] Current account type is individual");
        
        // TODO: Why the gender is female here?
        var account = {
            email: email,
            password: password,
            username: username,
            gender: 'Female'
        };

        connection.query("INSERT INTO user SET ?", account, function(err, res){
            if ( err )  {
                throw err;
            }
        });
    } else {
        console.log("[DEBUG] Current account type isn't individual");
        var account = {
            email: email,
            password: password,
            username: username,
            type: 'art'
        };

        // TODO: Merge the query sentences
        connection.query("INSERT INTO user SET ?", account, function(err, res){
            if ( err )  {
                throw err;
            }
        });
    }
})


// app.post('users/',function (req, res)
// {
// 	var body = req.body;
// 	var myName = body.name;
// 	var myPassword = body.password;
//
// 	if(!myName || !myPassword)//no username or password
// 	{
// 		res.send('{}');
//       	return;
// 	}
// 	else
// 	{
// 		//check database to see if the user name and password are correct
// 		//use MySQL
//
// 		connection.query("SELECT * FROM user WHERE username=myName AND password=myPassword",
// 			function(err, rows, fields)
// 		{
//
// 			if(err)
// 			{
// 				res.send('{}');
// 				return;
// 			}
// 			else
// 			{
// 				if(!rows[0])
// 				{
// 					res.send('{}');
// 					return;
// 				}
// 				else
// 				{
// 					var a = {name: rows[0].username,
// 						gender: rows[0].gender,
// 						email: rows[0].email};
//
// 					res.send(a);
// 					return;
// 				}
// 			}
// 		});
// 	}
// });



// connection.query('SELECT * FROM user', function(err, rows, fields)
// {
//   if (err) throw err;

//   console.log(rows[0]);
// });

http.listen(config.server.port, function(){
  console.log('[DEBUG] Listening on *:' + config.server.port);
});
