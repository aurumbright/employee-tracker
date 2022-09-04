const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the company_db database.`)
);

const starterQuestions = [
    {
        type: "list",
        name: "selection",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
        ],
    },
];

const addDepartmentInput = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Enter name of department: ',
    },
];

const addRoleInput = [
    {
        type: 'input',
        name: 'roleName',
        message: 'Enter name of role: ',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter salary for the new role: ',
    },
    {
        type: 'input',
        name: 'department',
        message: 'Enter department for new role: ',
    },
];

const addEmployeeInput = [
    {
        type: 'input',
        name: 'employeeFirstName',
        message: "Enter employee's first name: ",
    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: "Enter employee's last name: ",
    },
    {
        type: 'input',
        name: 'employeeRole',
        message: 'Enter employee role: ',
    },
    {
        type: 'input',
        name: 'managerName',
        message: "Enter employee's manager: ",
    },
];

const updateEmployeeInput = [
    {
        type: 'list',
        name: 'employeeNames',
        message: "Select employee: ",
    },
    {
        type: 'input',
        name: 'employeeNewRole',
        message: "Enter employee's new role: ",
    },
];

async function employeeTracker() {
    try {
        const userInput = await inquirer.prompt(starterQuestions);


        switch (userInput.selection) {
            case "View all departments":
                try {
                    db.query('SELECT * FROM departments', function (err, results) {
                        const table = cTable.getTable(results);
                        console.log(table);
                      });

                } catch (err) {
                    console.log(err.name + " in printing departments");
                }
                break;
            case "View all roles":
                try {
                    db.query('SELECT * FROM company_role', function (err, results) {
                        const table = cTable.getTable(results);
                        console.log(table);
                      });

                } catch (err) {
                    console.log(err.name + " in printing roles");
                }
                break;
            case "View all employees":
                try {
                    db.query('SELECT * FROM employees', function (err, results) {
                        const table = cTable.getTable(results);
                        console.log(table);
                      });

                } catch (err) {
                    console.log(err.name + " in printing employees");
                }
                break;

            case "Add a department":
                try {
                    const departmentInput = await inquirer.prompt(addDepartmentInput);
                    const { departmentName } = departmentInput;
                  
                    db.query('INSERT INTO departments (department_name) VALUES (?)', departmentName, function (err,results) {
                        console.log(results);
                    })

                } catch (err) {
                    console.log(err.name + " in intern creation");
                }
                break;
            case "Add a role":
                try {

                } catch (err) {
                    console.log(err.name + " in intern creation");
                }
                break;
            case "Add an employee":
                try {

                } catch (err) {
                    console.log(err.name + " in intern creation");
                }
                break;

            case "Update an employee role":
                try {
                    // inquirer: select employee
                    // ask for new role
                    //UPDATE employees SET role = ? WHERE id = ?
                } catch (err) {
                    console.log(err.name + " in intern creation");
                }
                break;
        }
    } catch (err) {
        console.log(err.name + " in running application");
    } finally {
        

    }
}

employeeTracker();