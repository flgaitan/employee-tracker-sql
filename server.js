const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoletable = require('console.table');

//creating connection store inside var DB
const db = mysql.createConnection({
    host: 'localhost', 
    passowrd: '',
    user: 'root',
    database: 'employee_tracker'

})

const initialQs = () =>{
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please select operation to perform',
            name: 'option',
            choices: ['view all employees','view all departments', 'add Employee', ]
        

        }
    ]).then (result => {
        if (result.option === 'view all employees'){
            viewAllEmployees();
        }
    })
}
// function to get employees
 function viewAllEmployees () {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) console.log(err);
        console.table(res);
    })
 }
