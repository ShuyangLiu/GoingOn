var mysql = require('mysql');  
var express = require('express');
var app = express();
var http = require('http').Server(app); // start an http server


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
connection.connect();  

connection.query('SELECT * FROM user', function(err, rows, fields)   
{  
  if (err) throw err;  
  
  console.log(rows[0]);  
});  

http.listen(3000, function(){
  console.log('listening on *:3000');
});

