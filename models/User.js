/**
 * User Model.
 */

var express = require('express'),
    app     = express();

/**
 * MUST BE REMOVED LATER!!
 */
var mysql   = require('mysql'),
    config  = require('../config');
connection = mysql.createPool({
        connectionLimit: config.database.connectionLimit,
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    });

exports.getUserUsingUsername = function(username, callback) {
    var user = null;

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
                userGroup: results[0]['user_group_id']
            }
        }
        callback(user);
    });
}

exports.getUserUsingEmail = function(email, callback) {
    var user = null;

    connection.query({
        sql: 'SELECT * FROM `go_users` WHERE `email` = ?',
        timeout: 30000,
    }, [email], function (error, results, fields) {
        if ( error ) {
            throw error;
        }
        if ( results.length != 0 ) {
            user = {
                username: results[0]['username'],
                password: results[0]['password'],
                email: results[0]['email'],
                userGroup: results[0]['user_group_id']
            }
        }
        callback(user);
    });
}

exports.createUser = function(user, callback) {
    connection.query({
        sql: 'INSERT INTO `go_users` VALUES `username` = ?, `password` = ?, `email` = ?, `user_group_id` = ?',
        timeout: 30000,
    }, [
        user['username'], 
        user['password'], 
        user['email'], 
        user['userGroupId'], 
    ], function (error, results) {
        if ( error ) {
            throw error;
        }
        user['uid'] = result.insertId;
        callback(user);
    });
}