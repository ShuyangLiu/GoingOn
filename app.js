var mysql = require('mysql');
var express = require('express');

var app = express();
var http = require('http').Server(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true 
}));

app.use(express.static('views'));
app.use(express.static('assets'));

var config = require('./config');
var connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});
connection.connect(function(err){
    if ( !err ) {
        console.log("[DEBUG] Database is connected...");
    } else {
        console.log("[DEBUG] Error connecting database...");
    }
});


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

http.listen(config.server.port, function(){
    console.log('[DEBUG] Listening on *:' + config.server.port);
});
