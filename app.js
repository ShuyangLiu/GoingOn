var mysql = require('mysql');
var express = require('express');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var app = express();
var http = require('http').Server(app); // start an http server


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



// app.set('views', './views');

// app.set('view engine', 'jade');

// app.get('/', function (req, res) {
//   res.render('index', { title: 'Hey', message: 'Hello there!'});
// });

app.use(express.static('views'));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Lsy950621!',
  database : 'goingon'
});
connection.connect(function(err){
 if(!err)
 {
     console.log("Database is connected ... \n\n");
 }
 else
 {
     console.log("Error connecting database ... \n\n");
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

  console.log("enter the function");

  var body = req.body;
  var username = body.username;
  var password = body.password;
  var email = body.email;
  var acount_type = body.acount_type;



  if(acount_type=="individual")
  {

    console.log("type individual");
    var acount = {email:email,password:password,username:username,gender:'Female'};

    connection.query("INSERT INTO user SET ?",acount,function(err,res){
        if(err) throw err;
      });
  }
  else
  {
    var acount = {email:email,password:password,username:username,type:'art'};

    connection.query("INSERT INTO organization SET ?",acount,function(err,res){
        if(err) throw err;
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

http.listen(3000, function(){
  console.log('listening on *:3000');
});
