/**
 * UserGroup Model.
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


exports.getUserGroupUsingSlug = function(userGroupSlug, callback) {
    var userGroup = null;

    connection.query({
        sql: 'SELECT * FROM `go_user_groups` WHERE `user_group_slug` = ?',
        timeout: 30000,
    }, [userGroupSlug], function (error, results, fields) {
        if ( error ) {
            throw error;
        }
        if ( results.length != 0 ) {
            userGroup = {
                userGroupId: results[0]['user_group_id'],
                userGroupSlug: results[0]['user_group_slug'],
                userGroupName: results[0]['user_group_name']
            }
        }
        callback(userGroup);
    });
}