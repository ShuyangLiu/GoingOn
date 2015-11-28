/**
 * Activity Model.
 */


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

//add a new event to the database
exports.createNewEvent = function(NewEvent){
      var fiber = fibers.current;
      connection.query({
          sql: 'INSERT INTO `go_activities` (`activity_name`, `activity_group`, `activity_type`, `activity_time`, `activity_location`, `activity_description`) VALUES (?, ?, ?, ?, ?, ?)',
          timeout: 30000,
      },[
          NewEvent['activity_name'],
          NewEvent['activity_group'],
          NewEvent['activity_type'],
          NewEvent['activity_time'],
          NewEvent['activity_location'],
          NewEvent['activity_description']
      ],function (error, result)
      {
          if ( error )
          {
              throw error;
          }
          NewEvent['activity_id'] = result.insertId;
          fiber.run();
      });
      fibers.yield();
      return NewEvent;
}
