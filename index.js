const mysql = require('mysql2');
const express = require ('express');
const inquirer = require ('inquirer')


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded ({extended: false}));
app.use(express.json());

// Create a connection to the MySQL database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Sql@1982',
      database: 'employee_db'
    },
    // console.log(`Connected to the books_db database.`)
);
    db.connect((err) => {
        if (err) throw err;
        console.log('Connected to the database.');
        questions();
    });

// Function to ask user question prompts

function questions() {
    inquirer
      .prompt({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'Add employee',
          'Add department',
          'Add role',
          'Update employee role',
          'View all departments',
          'View all roles',
                    
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.choice) {
            case 'View all employees':
                viewAllEMP();
                 break;
            case 'Add employee':
                addEMP();
                break;
            case 'Add department':
                addDEP();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Update employee role':
                updateEMProle();
                break;
            case 'View all departments':
                viewAllDEP();
                break;
            case 'View all roles':
                viewAllRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });;
  
}

// Function to view all employees

function viewAllEMP () {
    const query = `SELECT e.id, e.first_name, e.last_name, e_role.title, department.dname, e_role.salary, m.first_name AS Manager_Name
    FROM employee e 
    INNER JOIN e_role ON e.role_id = e_role.id
    INNER JOIN department ON e_role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`;

db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
});
}

// Function to add employee details

function addEMP () {

    // Prompts to get Employee details
    inquirer
        .prompt([
            {
                name: 'id', 
                type: 'input',
                message: "Enter the employee's unique ID",
            },
            {
                name:'first_name',
                type: 'input',
                message: "Enter the employee's first name:",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "Enter the employee's last name:",
            },
            {
                name: 'role_id',
                type: 'list',
                message: "Select the employee's job role id. Role ID order: IT Project Manager, HR EXECUTIVE, HR Manager, Front Desk Executive, Operations Manager, Admin Cleark and Admin Manager  ",
                choices: [
                    '001', 
                    '003',
                    '004',
                    '007',
                    '008',
                    '009',
                    '010',
                                               
                ],                
            },
            {
                name: 'manager_id',
                type: 'input',
                message: "Enter the employee's unique manager id:",                
            },

        ])
        .then((answers) => {

            const script = 'INSERT INTO employee SET ?';
            db.query(script, answers, (err, res) => {
                if (err) throw err;
                console.log('Employee details successfully added');
                questions();
            });
          
        });
}

// Function to add a department
function addDEP() {
    inquirer
    .prompt([
        {
            name: 'id',
            type: 'input',
            message: 'Enter the department ID:',
        },
        {
            name: 'dname',
            type: 'input',
            message: 'Enter the department name:',
        }
        
    ])
    .then((answers) => {
      const script = 'INSERT INTO department SET ?';

      db.query(script, answers, (err, res) => {
        if (err) throw err;
        console.log("Department details successfully added!");
        questions();
      });
    });
     
}

//Function to add roles
function addRole() {
    inquirer
    .prompt([
        {
            name: 'id',
            type: 'input',
            message:'Enter the unique 3 digit role ID:',
        },
        {
            name: 'title',
            type: 'input',
            message: 'Enter the role title:',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role:',
        },
        {
            name: 'department_id',
            type: 'input',
            message: 'Enter the 3 digit unique department ID related to the role:',
        },
        
    ])
    .then((answers) => {
        const script = 'INSERT INTO e_role SET ?';
  
        db.query(script, answers, (err, res) => {
          if (err) throw err;
          console.log("New role details successfully added!");
          questions();
        });
      });

}
  