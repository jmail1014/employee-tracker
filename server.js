const mysql = require("mysql2");
const inquier = require("inquirer");
require("console.table");

const connection = require("./db/connection.js");

let employeeChoices;
let roleChoices;

connection.connect(function (err) {
  if (err) throw err;

  firstPrompt();
});

function firstPrompt() {
  inquier
    .prompt({
      name: "task",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        // "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    })
    .then(function ({ task }) {
      switch (task) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        // case "View All Roles":
        //   viewAllRoles();
        //   break;

        case "Add Role":
          addRole();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Quit":
          connection.end();
          break;
      }
    });
}

// view all employees
function viewAllEmployees() {
  console.log("Viewing all employees:");

  var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS departments, r.salary
  FROM employees e
  JOIN roles r
  ON role_id = r.id
  JOIN departments d
  ON d.id = department_id`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);

    firstPrompt();
  });
}

// add an employee
function addEmployee() {
  var query = `SELECT r.id, r.title, r.salary
        FROM roles r`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));
    console.table(res);

    // function promptInsert(roleChoices) {
    inquier
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Which role is the employee?",
          choices: roleChoices,
        },
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
        },
      ])
      .then(function ({ role, firstName, lastName }) {
        let newEmployee = {
          role_id: role,
          first_name: firstName,
          last_name: lastName,
        };
        var query = `INSERT INTO employees SET ?`;

        connection.query(query, newEmployee, function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "successfully updated");

          firstPrompt();
        });
      });
  });
}

// update a employees role
function updateEmployeeRole() {
  employeeArray();
}

function employeeArray() {
  console.log("Updating an employee");

  var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS departments, r.salary
  FROM employees e
  JOIN roles r
  ON role_id = r.id
  JOIN departments d
  ON d.id = department_id`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));

    console.table(res);

    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("Updating role");

  var query = `SELECT r.id, r.title, r.salary
        FROM roles r`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));

    console.table(res);
    inquier
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee will have this role?",
          choices: employeeChoices,
        },
        {
          type: "list",
          name: "roleId",
          message: "Which role do you want to update?",
          choices: roleChoices,
        },
      ])
      .then(function (answer) {
        var query = `UPDATE employees SET role_id = ? WHERE id = ?`;

        connection.query(
          query,
          [answer.roleId, answer.employeeId],
          function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log(res.affectedRows + "secessfully updated");

            firstPrompt();
          }
        );
      });
  });
}

// view all roles
// function viewAllRoles() {
//   console.log("Viewing all roles:");

//   var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department,
//   r.salary, CONCAT(m.first_name, ' ', m.last_name)
//   AS manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id
//   LEFT JOIN departments d ON d. id = r.department_id
//   LEFT JOIN employees m ON m.id = e.manager_id`;

//   connection.query(query, function (err, res) {
//     if (err) throw err;

//     console.table(res);

//     firstPrompt();
//   });
// }

// add a new role
function addRole() {
  var query = `SELECT d.id, d.name, r.salary AS budget
  FROM employees e JOIN roles r 
  ON role_id = r.id
  JOIN departments d 
  ON d.id = r.department_id GROUP BY d.id, d.name`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`,
    }));

    console.table(res);

    promptAddRole(departmentChoices);
  });
}
function promptAddRole(departmentChoices) {
  inquier
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the role title?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the role salary?",
      },
      {
        type: "list",
        name: "departmentId",
        message: "What department does the role belong to?",
        choices: departmentChoices,
      },
    ])
    .then(function (answer) {
      var query = "INSERT INTO role SET ?";

      connection.query(
        query,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId,
        },
        function (err, res) {
          if (err) throw err;

          console.log(res);
          console.log("Role Created!");

          firstPrompt();
        }
      );
    });
}

// view all departments
function viewAllDepartments() {
  console.log("Viewing all departments");

  var query = `SELECT d.id, d.name
  FROM departments d`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map((data) => ({
      value: data.id,
      name: data.name,
    }));

    console.table(res);
    inquier
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department?",
          choices: departmentChoices,
        },
      ])
      .then(function (answer) {
        console.log("answer ", answer.departmentId);

        var query = `SELECT e.id, e.first_name, e.last_name, r.title 
        FROM employees e JOIN roles r `;

        connection.query(
          query,
          answer.departmentId,

          function (err, res) {
            if (err) throw err;

            console.table("response ", res);

            firstPrompt();
          }
        );
      });
  });
}
  // add a new department
  function addDepartment() {
  var query = `SELECT d.id, d.name
        FROM deparments d`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, name }) => ({
      value: id,
      name: `${name}`,
    }));
    console.table(res);

    inquier
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "What is the department name?",
        },
      ])
      .then(function ({ departmentName }) {
        let newEmployee = {
          department_name: depatmentName,
        };
        var query = `INSERT INTO departments SET ?`;

        connection.query(query, newdepartment, function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "successfully updated");

          firstPrompt();
  });
}
      )}
  )}

