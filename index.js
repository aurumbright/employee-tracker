const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

// connecting to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the company_db database.`)
);

// SQL queries to print lists of departments, roles, employees to inquirer
const departmentList = [];
function chooseDepartment() {
    db.query("SELECT department_name FROM departments", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            departmentList.push(res[i].department_name);
        }
    })
    return departmentList;
}

const roleList = [];
function chooseRole() {
    db.query("SELECT * FROM company_role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title);
        }
    })
    return roleList;
}

const employeeList = [];
function chooseEmployee() {
    db.query("SELECT first_name, last_name FROM employees", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            employeeList.push(res[i].first_name);
        }
    })
    return employeeList;
}

const employeeIdList = [];
function chooseEmployeeId() {
    db.query("SELECT id FROM employees", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            employeeIdList.push(res[i].id);
        }
    })
    return employeeIdList;
}

// Inquirer questions
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
            "Quit",
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
        type: 'list',
        name: 'department',
        message: 'Enter department for new role: ',
        choices: chooseDepartment()
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Enter manager for new role: ',
        choices: chooseEmployee()
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
        type: 'list',
        name: 'employeeRole',
        message: 'Enter employee role: ',
        choices: chooseRole()
    },
    {
        type: 'list',
        name: 'managerName',
        message: "Enter employee's manager: ",
        choices: chooseEmployee()
    },
];

const updateEmployeeInput = [
    {
        type: 'list',
        name: 'employeeName',
        message: "Select employee: ",
        choices: chooseEmployee()
    },
    {
        type: 'list',
        name: 'employeeId',
        message: 'Select employee ID: ',
        choices: chooseEmployeeId()
    },
    {
        type: 'list',
        name: 'employeeNewRole',
        message: "Enter employee's new role: ",
        choices: chooseRole()
    },
];

// Primary code
function employeeTracker() {
    inquirer
        .prompt(starterQuestions)
        .then(function (val) {

            switch (val.selection) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;

                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;

                case "Update an employee role":
                    updateEmployee();
                    break;

                case "Quit":
                        console.log("Thank you! Hit control + C to exit application.");
                    break;
            }
        })
}

// MYSQL queries for use by primary code
function viewDepartments() {
    db.query('SELECT id, department_name AS "Department" FROM departments', function (err, results) {
        if (err) throw err
        console.table(results);
        employeeTracker();
    })
}

function viewRoles() {
    db.query(`SELECT company_role.id, title AS 'Title', salary AS 'Salary', departments.department_name AS 'Department' 
                    FROM company_role 
                    JOIN departments ON company_role.department_id = departments.id;`,  function (err, results) {
        if (err) throw err
        console.table(results);
        employeeTracker();
    })
}

function viewEmployees() {
    db.query(`SELECT employees.id, employees.first_name AS 'First Name', employees.last_name AS 'Last Name', company_role.title AS 'Role', company_role.salary AS 'Salary', departments.department_name AS 'Department', CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employees
    JOIN company_role ON employees.role_id = company_role.id 
    JOIN departments ON company_role.department_id = departments.id
    LEFT JOIN employees m ON employees.manager_id = m.id;`, function (err, results) {
        if (err) throw err
        console.table(results);
        employeeTracker();
    })
}

function addDepartment() {

    db.query("SELECT department_name FROM departments", function (err, results) {
        inquirer
            .prompt(addDepartmentInput)
            .then(function (results) {
                db.query("INSERT INTO departments SET ?",
                    {
                        department_name: results.departmentName,
                    },
                    function (err) {
                        if (err) throw err
                        console.table(results);
                        employeeTracker();
                    })
            })
    })
}

function addRole() {
    db.query("SELECT company_role.title AS roleName, company_role.salary AS salary from company_role", function (err, results) {

        inquirer
            .prompt(addRoleInput)
            .then(function (results) {
                let departmentId = chooseDepartment().indexOf(results.department) + 1;

                db.query("INSERT INTO company_role SET ?",
                    {
                        title: results.roleName,
                        salary: results.salary,
                        department_id: departmentId,

                    },
                    function (err) {
                        if (err) throw err
                        console.table(results);
                        employeeTracker();
                    })
            })
    })
}

function addEmployee() {
    inquirer
        .prompt(addEmployeeInput)
        .then(function (results) {
            let roleId = chooseRole().indexOf(results.employeeRole) + 1;
            let managerId = chooseEmployee().indexOf(results.managerName) + 1;

            db.query("INSERT INTO employees SET ?",
                {
                    first_name: results.employeeFirstName,
                    last_name: results.employeeLastName,
                    role_id: roleId,
                    manager_id: managerId,
                },
                function (err) {
                    if (err) throw err
                    console.table(results);
                    employeeTracker();
                })
        })
}

function updateEmployee() {
    inquirer
        .prompt(updateEmployeeInput)
        .then(function (results) {
            let roleId = chooseRole().indexOf(results.employeeNewRole) + 1;

            let setItems = [roleId, results.employeeName, results.employeeId];

            db.query('UPDATE employees SET role_id=? WHERE employees.first_name=? AND employees.id=?', setItems);

            console.table(results);
            employeeTracker();
        })
}

// initialize primary
employeeTracker();