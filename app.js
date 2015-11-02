var mysql = require('mysql');  
var express = require('express');
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


app.post('users/',function (req, res)
{
	var body = req.body;
	var myName = body.name;
	var myPassword = body.password;

	if(!myName || !myPassword)//no username or password
	{
		res.send('{}');
      	return;
	}
	else
	{
		//check database to see if the user name and password are correct
		//use MySQL 

		connection.query("SELECT * FROM user WHERE username=myName AND password=myPassword", 
			function(err, rows, fields)
		{

			if(err)
			{
				res.send('{}');
				return;
			}
			else
			{
				if(!rows[0])
				{
					res.send('{}');
					return;
				}
				else
				{
					var a = {name: rows[0].username,
						gender: rows[0].gender,
						email: rows[0].email};

					res.send(a);
					return;
				}
			}
		});
	}
});



// connection.query('SELECT * FROM user', function(err, rows, fields)   
// {  
//   if (err) throw err;  
  
//   console.log(rows[0]);  
// });  

http.listen(3000, function(){
  console.log('listening on *:3000');
});

