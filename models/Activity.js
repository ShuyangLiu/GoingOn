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

//return all activities in the Database
exports.getAllActivities = function(){
  var fiber = fibers.current;
  var allActivities = [];
  var activity = null;
  connection.query({
    sql: 'SELECT * FROM go_activities',
    timeout: 30000,
  },function(error,rows,fields){
    if ( error )
    {
        throw error;
    }

    for (var i=0; i<rows.length; i++) {
      console.log(i);
      activity = {
          activity_name: rows[i]['activity_name'],
          activity_time: rows[i]['activity_time'],
          activity_type: rows[i]['activity_type'],
          activity_location: rows[i]['activity_location'],
          activity_description: rows[i]['activity_description'],
          activity_group: rows[i]['activity_group']
      };
      console.log('[DEBUG]activity: \n');
      console.log(activity);
      allActivities.push(activity);
      console.log('[DEBUG]allActivities: \n');
      console.log(allActivities);
    }

    fiber.run();

  });
  fibers.yield();
  return allActivities;
}
