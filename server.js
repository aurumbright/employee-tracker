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

const managerList = [];
function chooseManager() {
    db.query("SELECT first_name, last_name FROM employees", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managerList.push(res[i].first_name);
        }
    })
    return managerList;
}

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
        choices: chooseManager()
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
        choices: chooseManager()
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
                    try {

                    } catch (err) {
                        console.log(err.name + " in choice");
                    }
                    break;
            }
        })
}

function viewDepartments() {
    db.query('SELECT * FROM departments', function (err, results) {
        if (err) throw err
        console.table(results);
        employeeTracker();
    })
}

function viewRoles() {
    db.query('SELECT * FROM company_role', function (err, results) {
        if (err) throw err
        console.table(results);
        employeeTracker();
    })
}

function viewEmployees() {
    db.query('SELECT * FROM employees', function (err, results) {
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
                db.query("INSERT INTO company_role SET ?",
                    {
                        title: results.roleName,
                        salary: results.salary,

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
            let managerId = chooseManager().indexOf(results.managerName) + 1;

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

    // inquirer: select employee
    // ask for new role
    //UPDATE employees SET role = ? WHERE id = ?

}

employeeTracker();