const mysql = require('mysql2');
const express = require ('express');
const inquirer = require ('inquirer')


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded ({extended: false}));
app.use(express.json());

let fname;
let rID;

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
                db.end();
                break;
        }
    });;
  
}

// Function to view all employees

function viewAllEMP () {
    const script = `SELECT e.id AS EMP_ID, e.first_name AS EMP_First_Name, e.last_name AS EMP_Last_Name, e_role.title AS EMP_Role_Title, department.dname AS EMP_Department, e_role.salary AS EMP_Salary, m.first_name AS Manager_First_Name
    FROM employee e 
    INNER JOIN e_role ON e.role_id = e_role.id
    INNER JOIN department ON e_role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`;

db.query(script, (err, res) => {
    if (err) throw err;
    console.table(res);
    wrapper ();    
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
                wrapper ();
            });
          
        });
}

// Function to add a department
function addDEP() {
//Prompts to get new Department information
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
        wrapper (); 
      });
    });
     
}

//Function to add roles
function addRole() {
//Prompts to get new Role information
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
          wrapper (); 
        });
      });
}

//Function to update employee details
function updateEMProle() {

    const script = `SELECT employee.id, employee.first_name, employee.last_name, e_role.title, e_role.id AS RoleID
    FROM employee  
    INNER JOIN e_role ON employee.role_id = e_role.id`;


    db.query(script, (err, res) => {
        if (err) throw err;
        console.table(res);
    });

    

    db.query ('SELECT first_name FROM employee', (err, results) => {
        if (err) throw err;

        const values = results.map((row) => row.first_name);

           // Prompt the user to select a name
         inquirer
            .prompt([
            {
                type: 'list',
                name: 'first_name',
                message: 'Select a name:',
                choices: values,
            },
        ])
        .then((answers) => {
        fname = answers.first_name;
        console.log(`You selected: ${fname}`);
        promptRole()
        });

    });
    
    // Prompt the user to select a Role ID
    function promptRole() {
        db.query ('SELECT id FROM e_role ORDER BY id', (err, results) => {
            if (err) throw err;
            const values = results.map((row) => row.id);
    
        inquirer
        .prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Select a valid Role ID to update the employees details:',
            choices: values,
        },
         ])
        .then((answers) => {
        rID = answers.id;
        console.log(`You selected: ${rID}`);
        updateEMPRole()
        });

    });
    }
    // Update employee role details
    function updateEMPRole() {
        db.query(
            'UPDATE employee SET role_id = ? WHERE first_name = ?',
            [rID, fname],
            (error, results) => {
              if (error) {
                console.error(error);
              } else {
                console.log('Update successful');
              }             
              wrapper (); 
            }
          );
    }
}

//Function to view all department details
function viewAllDEP() {
    const script = ` SELECT id AS Department_ID, dname AS Department_Name
    FROM department
    ORDER BY id`;

    db.query(script, (err, res) => {
        if (err) throw err;
        console.table(res);
        wrapper (); 
    });
    
} 

//Function to view all roles
function viewAllRole() {
    const script = ` SELECT R.id AS Role_ID, R.title AS Role_Title, R.salary AS Role_Salary, department.dname AS Department_Name
    FROM e_role R
    INNER JOIN department ON R.department_id = department.id
    ORDER BY R.id`;

    db.query(script, (err, res) => {
        if (err) throw err;
        console.table(res);
        wrapper (); 
    });
   }
  
//Function to re-navigate through the options or to end the process
function wrapper () {

   inquirer
  .prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Do you want to proceed?',
      default: false,
    },
  ])
  .then((answers) => {
    if (answers.proceed) {
      questions();
    } else {
      console.log('You chose not to proceed.');
      db.end();
    }
  });
}