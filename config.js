/**
 * The configuration of the application
 * @type {Object}
 */
var config = {
    // MySQL Connection Settings
    database: {
        connectionLimit : 1,
        host            : 'localhost',
        user            : 'root',
        password        : 'Lsy950621!',
        database        : 'goingon'
    },
    // Server Settings
    server: {
        port: '3000'
    }
}

module.exports = config;
