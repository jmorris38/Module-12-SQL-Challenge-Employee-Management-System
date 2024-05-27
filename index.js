const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

init();

// Display logo text for the , load main prompts
function init() {
  const logoText = logo({ name: "Employee Management System" }).render();
  console.log(logoText);
  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "View all departments", value: "findAllDepartments" },
        { name: "View all roles", value: "findAllRoles" },
        { name: "View all employees", value: "findAllEmployees" },
        { name: "Add a department", value: "createDepartment" },
        { name: "Add a role", value: "createRole" },
        { name: "Add an employee", value: "createEmployee" },
        { name: "Update an employee role", value: "updateEmployeeRole" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]).then(async (userData) => {
    switch (userData.choice) {
      case "findAllDepartments":
        console.log("You have selected to view all departments");
        await findAllDepartments();
        break;
      case "findAllRoles":
        console.log("You have selected to view all roles");
        await findAllRoles();
        break;
      case "findAllEmployees":
        console.log("You have selected to view all employees");
        await findAllEmployees();
        break;
      case "createDepartment":
        console.log("You have selected to create a department");
        await createDepartment();
        break;
      case "createRole":
        console.log("You have selected to create a role");
        await createRole();
        break;
      case "createEmployee":
        console.log("You have selected to create an employee");
        await createEmployee();
        break;
      case "updateEmployeeRole":
        console.log("You have selected to update an employee role");
        await updateEmployeeRole();
        break;
      default:
        console.log("You have selected to exit the application");
        process.exit();
    }
  });
}

function findAllDepartments() {
  console.log("Found all departments");
  db.findAllDepartments()
    .then(({ rows }) => {
      let departments = rows;
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}

function findAllRoles() {
  console.log("Found all roles");
  db.findAllRoles()
    .then(({ rows }) => {
      let roles = rows;
      console.table(roles);
    })
    .then(() => loadMainPrompts());
}

function findAllEmployees() {
  console.log("Found all employees");
  db.findAllEmployees()
    .then(({ rows }) => {
      let employees = rows;
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}

function createDepartment() {
  prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the department?",
    },
  ]).then((data) => {
    db.createDepartment(data.name)
      .then(() => {
        console.log("Added department to the database");
        loadMainPrompts();
      })
      .catch((err) => {
        console.error("Error adding department", err);
        loadMainPrompts();
      });
  });
}

function createRole() {
  prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "input",
      name: "department_name",
      message: "Which department does the role belong to?",
    },
  ]).then((data) => {
    db.createRole(data)
      .then(() => console.log("Role created"))
      .then(() => loadMainPrompts());
  });
}

async function createEmployee() {
  const roles = await db.findAllRolesForChoices();
  //console.log(roles);
  const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.title }));

  const employees = await db.findAllEmployees();
  //console.log(employees);
  const managerChoices = [{ name: "None", value: "None" }].concat(employees.rows.map(employee => ({
    name: `${employee.employee_first_name} ${employee.employee_last_name}`,
    value: `${employee.employee_first_name} ${employee.employee_last_name}`
  })));

  prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role_title",
      message: "What is the employee's role?",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: managerChoices,
    },
  ]).then((data) => {
    db.createEmployee(data)
      .then(() => console.log("Employee created"))
      .then(() => loadMainPrompts());
  });
}

async function updateEmployeeRole() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const roles = await db.findAllRoles();
  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices,
    },
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices,
    },
  ]).then((data) => {
    db.updateEmployeeRole(data.employeeId, data.roleId)
      .then(() => {
        console.log("Employee role updated successfully");
        loadMainPrompts();
      })
      .catch((error) => {
        console.error("Error updating employee role:", error);
      });
  });
}
