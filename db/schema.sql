-- Drops the "employees_db" database if it exists --
DROP DATABASE IF EXISTS employees_db;
-- Creates the "employees_db" database --
CREATE DATABASE employees_db;

-- Use the employees_db --
\c employees_db

-- Creates the table "department" within employees_db --
CREATE TABLE department (
    -- Creates a numeric column called "id" --
    id SERIAL PRIMARY KEY,
    -- Creates a string column called "department_name" which can hold up to 50 characters --
    department_name VARCHAR(50)
);
-- Creates the table "role" within employees_db --
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    -- Creates a foreign key that references the "department" table's "id" column --
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);
-- Creates the table "employee" within employees_db --
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    -- Creates a foreign key that references the "role" table's "id" column --
    FOREIGN KEY (role_id)
    REFERENCES role (id),
    -- Creates a foreign key that references the "employee" table's "id" column --
    FOREIGN KEY (manager_id)
    REFERENCES employee (id)
);