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
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'view all departments', 
                'Add department',
                'Add role',
                'Add Employee', 
                'Update employee role',
                'Update employee manager',
                'View employees by department',
                'View employees by manager',
                'Remove department',
                'Remove role',
                'Remove employee',
                'Exit'
            ]
        }
    ])
    .then (result => {
        if (result.option === 'view all departments'){
            viewDepartments();
        }
        if (result.option === 'view all roles'){
            viewRoles();
        }
        if (result.option === 'view all employees'){
            viewAllEmployees();
        } 
        if (result.option === 'Add department'){
            addDept();
        } 
        if (result.option === 'Add role'){
            addRoles();
        } 
        if (result.option === 'Add employee'){
            addEmployee();
        } 
        if (result.option === 'Update employee role'){
            updateRole();
        } 
        if (result.option === 'Update employee manager'){
            updateEmpManager();
        } 
        if (result.option === 'view employees by department'){
            viewByDept();
        } 
        if (result.option === 'view employees by manager'){
            viewByManager();
        } 
        if (result.option === 'Remove a department'){
            removeDept();
        } 
        if (result.option === 'Remove employee role'){
            removeRole();
        } 
        if (result.option === 'Remove a employee'){
            removeEmployee();
        } 
        if (result.option === 'Exit'){
            Exit();
        }; 
    })
};
// function to get employees
const viewDepartments = () => {
    const sql = `SELECT id, name FROM department;`;
    db.query(sql, (err, res) => {
        if (err) console.log(err);
        console.table(res);
        initialQs(); 
    });
 };

const viewRoles = () => {
    const sql = 
    `SELECT role.id,role.title,role.salary,department.id AS department FROM role LEFT JOIN department ON department.id = role.department_id;`;
db.query(sql, (err, rows) => {
if (err) {
    console.log(err);
}
console.table(rows);
initialQs();
});
};

const viewAllEmployees = () => {
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name,
                        role.title AS title,
                        role.salary AS salary,
                        department.id AS department
                        FROM employee LEFT JOIN role ON role.id = employee.role_id 
                        LEFT JOIN department ON department.id = role.department_id;`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      }
      console.table(rows);
      initialQs();
    });
  };
//all code above works perfectly.....

  const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of this department?'
        }
    ])
    //USING INSERT INTO method to insert data into an existing table
    .then(result => {
        const sql = `INSERT INTO department(name) VALUES();`;
        const params = result.department_name;
        db.query(sql, params, (err) => {
            if (err) {
                console.log(err);
            }
            viewDepartments();
        });
    });

  };

const addRoles = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Name your role'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: salaryInput => {
                if (isNaN(salaryInput)) {
                    console.log("Please enter a valid ID")
                    return false;
                } else {
                    return true;
                }
            }
        }
    ])
    .then (result => {
        const params = [result.title, result.salary];
        const sql = `SELECT * FROM department;`;
        db.query (sql, (err, rows) => {
            if (err){
                console.log(err);
            }
            const department_name = rows.map(({name, id}) => ({name: name, value: id}));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: "What department is associated with this role?",
                    choices: department_name
                }
            ])
            .then(deptResponse => {
                const department = deptResponse.department;
                params.push(department);
                const sql = `INSERT INTO role(title, salary, department_id)
                VALUES (?,?,?);`;
                db.query(sql, params, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    viewRoles();
                });
            });
        });
    });
};




 initialQs();
