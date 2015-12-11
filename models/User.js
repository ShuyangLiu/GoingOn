/**
 * User Model.
 */

/**
 * MUST BE REMOVED LATER!!
 */
/* BEGIN */
var config      = require('../config'),
    fibers      = require('fibers'),
    mysql       = require('mysql'),
    connection  = mysql.createPool({
        connectionLimit: config.database.connectionLimit,
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    });

app.use(function(request, response, next) {
    fibers(function() {
        next();
    }).run();
});
/* END */

//Find a user by username
exports.getUserUsingUsername = function(username) {
    var user    = null,
        fiber   = fibers.current;

    connection.query({
        sql: 'SELECT * FROM `go_users` WHERE `username` = ?',
        timeout: 30000,
    }, [username], function (error, results, fields) {
        if ( error ) {
            throw error;
        }
        if ( results.length != 0 ) {
            user = {
                username: results[0]['username'],
                password: results[0]['password'],
                email: results[0]['email'],
                uid : results[0]['uid'],
                userGroupId: results[0]['user_group_id']
            }
        }
        fiber.run();
    });
    fibers.yield();
    return user;
}

//Find a user by email
exports.getUserUsingEmail = function(email) {
    var user = null,
        fiber   = fibers.current;

    connection.query({
        sql: 'SELECT * FROM `go_users` WHERE `email` = ?',
        timeout: 30000,
    }, [email], function (error, results, fields) {
        if ( error ) {
            throw error;
        }
        if ( results.length != 0 ) {
            user = {
                username    : results[0]['username'],
                password    : results[0]['password'],
                email       : results[0]['email'],
                userGroupId : results[0]['user_group_id']
            }
        }
        fiber.run();
    });
    fibers.yield();
    return user;
}

//Create a new user
exports.createUser = function(user) {
    var fiber   = fibers.current;

    connection.query({
        sql: 'INSERT INTO `go_users` (`username`, `password`, `email`, `user_group_id`) VALUES (?, ?, ?, ?)',
        timeout: 30000,
    }, [
        user['username'],
        user['password'],
        user['email'],
        user['userGroupId'],
    ], function (error, result) {
        if ( error ) {
            throw error;
        }
        user['uid'] = result.insertId;
        fiber.run();
    });
    fibers.yield();
    return user;
}

//Update user information by replacing all the information
exports.updateUser = function(user){
    var fiber   = fibers.current;
    connection.query({
      sql: 'UPDATE `go_users` SET `username`=?, `password`=? WHERE `email`=?',
      timeout: 30000,
    }, [
        user['username'],
        user['password'],
        user['email'],
    ],function (error, result){
        if ( error ) {
          throw error;
        }
        console.log('[INFO] Changed ' + result.changedRows + ' rows');
        fiber.run();
      });
    fibers.yield();
    return user;
  }
