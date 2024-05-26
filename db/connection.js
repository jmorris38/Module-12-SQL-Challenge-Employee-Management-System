// Require the pg module
const { Pool } = require('pg')
// Establish connection to the database
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Default database to connect initially
    password: '123456',
    port: 5432,
});
// Export the connection
module.exports = client;