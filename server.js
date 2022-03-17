const mysql = require("mysql2");
const inquier = require("inquirer");
require("console.table");

connection.connect(function (err) {
  if (err) throw err;
  console.log("connect as id " + Connection.threadId);

  fistPrompt();
});

function fistPrompt() {
  inquier
    .prompt({
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
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

        case "View All Roles":
          viewAllRoles();
          break;

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

        var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, 
          r.salary, CONCAT(m.first_name, ' ', m.last_name) 
          AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id 
          LEFT JOIN department d ON d. id = r.department_id 
          LEFT JOIN employee m ON m.id = e.manager_id`;

        connection.query(query, function (err, res) {
          if (err) throw err;

          console.table(res);

          fistPrompt();
        });
      }

      // add an employee
      function addEmployee() {
        var query = 
        `SELECT r.id, r.title, r.salary
        FROM role r`

        connection.query(query, function (err, res) {
          if (err) throw err;

          const roleChoices = res.map(({ id, title, slaary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
          }));
          console.table(res);
      
          promptInsert(roleChoices);
        })
      }

      // update a employees role
      function updateEmployeeRole() {
        employeeArray();

      }

      function employeeArray() {
        console.log('Updating an employee');

        var query = 
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.fist_name, ' ', m.last_name) AS manager
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        JOIN employee m 
        ON m.id = e.manager_id`

        connnection.query(query, function (err, res) {
          if (err) throw err;

          const employeeChoices = res.map(({ id, fist_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
          }));

          console.table(res);

          roleArray(employeeChoices);
        });
      }

      function roleArray(employeeChoices) {
        console.log('Updating role');

        var query = 
        `SELECT r.id, r.title, r.salary
        FROM role r`
        let roleChoices;

        connection.query(query, function (err, res) {
          if (err) throw err;

          roleChoices = res.map(({ id, title, slary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
          }));

          console.table(res);

          promptEmployeeRole(employeeChoices, roleChoices);
        });
      }

      inquier
      .prompt([
        {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee will have this role?',
        choices: employeeChoices
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Which role do you want to update?',
          choices: roleChoices
        },
      ])
      .then(function (answer) {
        var query = `UPDATE employee SET role_id = ? WHERE id = ?`

        connection.query(query,
          [ answer.roleId,
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + 'secessfully updated');

          firstPromt();
        });
      });

      // // view all roles
      // function viewAllRoles() {}

      // add a new role
      function addRole() {

        var query = 
        `SELECT d.id, d.name, r.salary AS budget
        FROM employee e JOIN role r 
        ON e.role_id = r.id
        JOIN department d 
        ON d.id = r.department_id GROUP BY d.id, d.name`

        connection.query(query,
          function (err, res) {
            if (err) throw err;

            const departmentChoices = res.map(({ id, name }) => ({
              value: id,
              name: `${id} ${name}`
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

                fistPrompt();
              });
             });
      }

      // view all departments
      function viewAllDepartments() {
        console.log('Viewing all departments');

        var query = 
        `SELECT d.id, d.name, r.salary AS budget 
        FROM employee e
        LEFT JOIN role r 
        ON e.role_id = r.id
        LEFT JOIN department d 
        ON d.id = r.department_id
        GROUP BY d.id, d.name`

        connection.query(query, function (err, res) {
          if (err) throw err;

          const departmentChoices = res.map(data => ({
            value: data.id,
            name: data.name
          }));

          console.table(res);

          promptDepartment(departmentChoices);
      },

      function promptDepartment() {
        inquier
        prompt([
          {
            type: 'list',
            name: 'departmentId',
            message: 'Which department?',
            choices: departmentChoices
          }
        ])
        .then(function (answer) {
          console.log('answer ', 
          answer.departmentId);

          var query =
          `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
          FROM employee e JOIN role r on d.id = r.department_id 
          WHERE d.id = ?`

          connection.query(query,
            answer.departmentId, 
            
            function (err, res) {
              if (err) throw err;

            console.table('response ', res);

            fistPrompt();
          });
        });
      });
      // // add a new department
      // function addDepartment()
