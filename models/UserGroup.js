/**
 * UserGroup Model.
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


exports.getUserGroupUsingSlug = function(userGroupSlug) {
    var userGroup   = null,
        fiber       = fibers.current;

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
        fiber.run();
    });
    fibers.yield();
    return userGroup;
}
