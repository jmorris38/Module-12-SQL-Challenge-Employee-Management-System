


const { Client } = require('pg');

const createDatabaseAndTables = async () => {
  const initialClient = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Default database to connect initially
    password: '123456',
    port: 5432,
  });

  try {
    await initialClient.connect();

    // Terminate active connections to the "employees_db" database
    await initialClient.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'employees_db'
        AND pid <> pg_backend_pid();
    `);

    // Drop the database if it exists and create a new one
    await initialClient.query('DROP DATABASE IF EXISTS employees_db');
    await initialClient.query('CREATE DATABASE employees_db');

    console.log('Database created successfully!');

    // Disconnect from the initial client
    await initialClient.end();

    // Connect to the new database
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres', // Default database to connect initially
      password: '123456',
      port: 5432,
    });

    await client.connect();

    // Create the tables
    const createTablesQuery = `
      CREATE TABLE department (
        id SERIAL PRIMARY KEY,
        department_name VARCHAR(50)
      );

      CREATE TABLE role (
        id SERIAL PRIMARY KEY,
        title VARCHAR(30) UNIQUE NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
      );

      CREATE TABLE employee (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INTEGER NOT NULL,
        manager_id INTEGER,
        FOREIGN KEY (role_id) REFERENCES role(id),
        FOREIGN KEY (manager_id) REFERENCES employee(id)
      );
    `;

    await client.query(createTablesQuery);

    // Seed data into the tables
    const seedDataQuery = `
      INSERT INTO department (department_name)
      VALUES 
        ('Supply Chain'),
        ('Procurement'),
        ('Operations');

      INSERT INTO role (department_id, title, salary)
      VALUES 
        (1, 'Demand Manager', 100000),
        (1, 'Supply Chain Associate', 40000),
        (2, 'Procurement Manager', 95000),
        (2, 'Procurement Associate', 37500),
        (3, 'Operations Manager', 110000),
        (3, 'Operations Associate', 47500);

      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES 
        ('Justin', 'Morris', 1, NULL),
        ('Bob', 'Hamper', 2, 1),
        ('Paul', 'Lane', 3, NULL),
        ('James', 'Sheldon', 4, 3),
        ('Dom', 'Gingham', 5, NULL),
        ('Mia', 'Reynolds', 6, 5);
    `;

    await client.query(seedDataQuery);

    console.log('Tables created and data seeded successfully!');
    
    await client.end();
  } catch (err) {
    console.error('Error creating database, tables, or seeding data:', err);
  }
};

createDatabaseAndTables();

