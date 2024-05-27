// Requires the connection to the database
const pool = require("./connection");
// Class for the database to be used in the prompt questions
class DB {
  constructor() {}
// Async function to query the database
  async query(sql, args = []) {
    const client = await pool.connect(); // connects to the db
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release(); // closes the connection to the db
    }
  }

  // Find all departments
  findAllDepartments() {
    return this.query(
      "SELECT department.id, department.department_name FROM department"
    );
  }
  // Finds all roles
  findAllRoles() {
    return this.query(
      `SELECT role.title AS "Job Title", role.id, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id`
    );
  }
  findAllRolesForChoices() {
    return this.query(
      `SELECT role.title, role.id, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id`
    );
  }
  // Finds all employees
  findAllEmployees() {
    // Query to select all employees and change the manager_id to the manager's name using a LEFT JOIN on the employee table
    return this.query(`
    SELECT
      e.id AS employee_id,
      e.first_name AS employee_first_name,
      e.last_name AS employee_last_name,
      r.title AS job_title,
      d.department_name AS department,
      r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `);
  }
  // Create a new department, role, employee
  createDepartment(departmentName) {
    // Return a promise to handle the async nature of the query
    return new Promise((resolve, reject) => {
      this.query(
        `INSERT INTO department (department_name) VALUES ($1) RETURNING *`,
        [departmentName]
      )
        .then((result) => {
          resolve(result.rows[0]); // Resolve with the inserted row data
        })
        .catch((error) => {
          reject(error); // Reject with the error if the query fails
        });
    });
  }
  // Create a new role and use interpolation to insert the department name, title, and salary
  createRole(role) {
    return this.query(
      `INSERT INTO role (department_id, title, salary)
        VALUES (
            (SELECT id FROM department WHERE department_name = '${role.department_name}'),
            '${role.title}',
            ${role.salary}
        )`
    );
  }
  // Create a new employee, and use $1 values to insert the employee's first name, last name, role id, and manager id into the array of values
  createEmployee(employee) {
    return this.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id)
       VALUES ($1, $2, (SELECT id FROM role WHERE title = $3), (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = $4))`,
      [
        employee.first_name,
        employee.last_name,
        employee.role_title,
        employee.manager_name,
      ]
    );
  }
  // Update an employee's role by using the employee's name and role title to update the role_id, and use $1 and $2 to insert the employee name and role title into the array of values
  updateEmployeeRole(employee) {
    return this.query(
      `UPDATE employee
       SET role_id = (SELECT id FROM role WHERE title = $2)
       WHERE CONCAT(first_name, ' ', last_name) = $1`,
      [employee.employee_name, employee.role_title]
    );
  }
}

// Export the database functions for use in the prompt questions
module.exports = new DB();