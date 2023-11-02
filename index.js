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
    const query = `SELECT employee.id, employee.first_name, employee.last_name, e_role.title, department.dname, e_role.salary
    FROM employee 
    INNER JOIN e_role ON employee.role_id = e_role.id
    INNER JOIN department ON e_role.department_id = department.id`;

db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
});
}
  