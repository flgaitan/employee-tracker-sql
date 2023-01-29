const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoletable = require('console.table');

//creating connection store inside var DB
const db = mysql.createConnection({
    host:'127.0.0.1', 
    user: 'root',
    password: 'yourpasswd',
    database: 'employee_tracker'
})

const initialQs = () => {
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
        .then(result => {
            console.log(result);
            if (result.option === 'view all departments') {
                viewDepartments();
            }
            if (result.option === 'view all roles') {
                viewRoles();
            }
            if (result.option === 'view all employees') {
                viewAllEmployees();
            }
            if (result.option === 'Add department') {
                addDept();
            }
            if (result.option === 'Add role') {
                addRoles();
            }
            if (result.option === 'Add Employee') {
                addEmployee();
            }
            if (result.option === 'Update employee role') {
                updateEmpRole();
            }
            if (result.option === 'Update employee manager') {
                updateEmpManager();
            }
            if (result.option === 'view employees by department') {
                viewByDept();
            }
            if (result.option === 'view employees by manager') {
                viewByManager();
            }
            if (result.option === 'Remove a department') {
                removeDept();
            }
            if (result.option === 'Remove employee role') {
                removeRole();
            }
            if (result.option === 'Remove a employee') {
                removeEmployee();
            }
            if (result.option === 'Exit') {
                Exit();
            };
        })
};
// function to get employees
const viewDepartments = () => {
    const sql = `SELECT department.id, department.department_name FROM department;`;
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
                        LEFT JOIN department ON department.id = role.department.id;`;
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
            const sql = `INSERT INTO department(department_name) VALUES ('${result.name}')`;
            // const params = result.department_name;
            db.query(sql, (err) => {
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
        .then(result => {
            const params = [result.title, result.salary];
            const sql = `SELECT * FROM department;`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                }
                const department_name = rows.map(({ name, id }) => ({ name: name, value: id }));
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'department',
                        message: "What department is associated with this role?",
                        // choices: department.map(department => ({ name: department.name, value: department.id }))
                        choices: department_name
                    }
                ])
                console.log(department_name)
                console.log(title, "title")
                console.log(salary, "salary")
                console.log(department, "dept")
                    //do console log(row)
                    //console.log(department_name)
                    .then(deptResponse => {
                        const department = deptResponse.department;
                        params.push(department);
                        const sql = `INSERT INTO role(title, salary, department.id)
                     VALUES ('${deptResponse.title, deptResponse.salary, deptResponse.department.id}');`;
                        console.log(deptResponse.title)
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
//works fine, on role add number
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter employee first name'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter employee last name'
        }
    ])
            .then(result => {
                const params = [result.first_name, result.last_name];
                const sql = `SELECT * FROM employee`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                    const byManager = rows.map(({ first_name, last_name, id}) => ({ name: `${first_name} ${last_name}`, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employee manager?',
                            choices: byManager
                        }
                    ])
                        .then(managerResult => {
                            const manager = managerResult.manager;
                            params.push(manager);
                            //console.log(params)
                            let sql = `SELECT * FROM role;`
                            db.query(sql, (err, rows) => {
                                let roleDetails = rows.map(({id, title})=> ({name: title, value: id}));
                                inquirer.prompt([
                                    {
                                        type: 'list',
                                        name: 'role',
                                        message: 'What is the role of the employee?',
                                        choices: roleDetails
                                    }
                                ])
                                .then(data => {
                                    params.push(data.role);
                                    console.log(params)
                                    const sql = `INSERT INTO employee(first_name, last_name, manager_id, role_id) VALUES('${params[0]}', '${params[1]}', '${params[2]}', '${params[3]}');`;
                                    db.query(sql, params, (err) => {
                                        if (err) {
                                        console.log(err);
                                    }
                                    viewAllEmployees();
                                });
                            });
                        });
                         
                    });
                });
            });
        };

const updateEmpRole = () => {
    const sql = `SELECT first_name, last_name, id FROM employee`
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        const employee = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        //console.log(employee)
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee role would you like to update?",
                choices: employee
            }
        ])
        .then(employeesResult => {
            //console.log(employeesResult)
            const employees = employeesResult.employee;
            const params = [employees];
            //console.log(params)
            const sql = `SELECT title, id FROM role`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                  }
                  const roleList = rows.map(({title, id}) => ({name: title, value: id}));
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "role",
                      message: "What is the new role of this employee?",
                      choices: roleList
                    }
                ])
                .then(roleResult => {
                    const role = roleResult.role;
                    params.unshift(role);
                    console.log(params)
                    const sql = `UPDATE employee
                                  SET role_id = ${params[0]}
                                  WHERE id = ${params[1]}`
                    db.query(sql, params, (err) => {
                        if (err) {
                        console.log(err);
                      }
                      viewAllEmployees();
                    });
                  });
                });
              });
            });
          };
    
          const updateEmpManager = () => {
            const sql = `SELECT first_name, last_name, id FROM employee`
            db.query(sql, (err, rows) => {
              if (err) {
                console.log(err);
              }
              const employee = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
              console.log(employee)
              inquirer.prompt([
                {
                  type: "list",
                  name: "employee",
                  message: "Which employee would you like to update?",
                  choices: employee
                }
              ])
              .then(employeesResult => {
                console.log(employeesResult)
                const employees = employeesResult.employee;
                const params = [employees];
                 console.log(params)
                const sql = `SELECT first_name, last_name, id FROM employee`;
                db.query(sql, (err, rows) => {
                  if (err) {
                   console.log(err); 
                  }
                  const managerList = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Who is this employee's new manager?",
                      choices: managerList
                    }
                  ])
                  .then(managerResult => {
                    const manager = managerResult.manager;
                    params.unshift(manager);
                    console.log(params)
                    const sql = `UPDATE employee
                                  SET manager_id = ${params[0]}
                                  WHERE id = ${params[1]}`
                    db.query(sql, params, (err) => {
                      if (err) {
                        console.log(err);
                      }
                     viewAllEmployees();
                    });
                  });
                });
              });
            });
          };
          
          const viewByManager = () => {
            const sql = `SELECT first_name, last_name, id FROM employee`;
            db.query(sql, (err, rows) => {
              if (err) {
                console.log(err);
              }
              const employee = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
              inquirer.prompt([
                {
                  type: "list",
                  name: "employee",
                  message: "Select a manager's employee you would like to view?",
                  choices: employee
                }
              ])
              .then(employeeAnswer => {
                const manager = employeeAnswer.employee;
                const params = [manager];
                const sql = `SELECT id, first_name, last_name FROM employee
                              WHERE manager_id = ${params[0]}`
                db.query(sql, params, (err, rows) => {
                  if (err) {
                    console.log(err);
                  }
                  console.table(rows);
                })
                  viewAllEmployees();
                });
            });
        };
          
        //   const viewByDept = () => {
        //     const sql = `SELECT * FROM department`;
        //     db.query(sql, (err, rows) => {
        //       if (err) {
        //         console.log(err);
        //       }
        //       const departments = rows.map(({name, id}) => ({name: department_name, value: id}));
        //       inquirer.prompt([
        //         {
        //           type: "list",
        //           name: "employee",
        //           message: "Which employee department would you like to view?",
        //           choices: departments
        //         }
        //       ])
        //       .then(empResult => {
        //         const department = empResult.employee;
        //         const params = [department];
        //         const sql = `SELECT employee.id, first_name, last_name, department_name AS department
        //                       FROM employee
        //                       LEFT JOIN role ON employee.role_id = role.id
        //                       LEFT JOIN department ON role.department_id = department.id
        //                       WHERE department.id = ${params}`;
        //         db.query(sql, params, (err, rows) => {
        //           if (err) {
        //             console.log(err);
        //           }
        //           console.table(rows);
        //           viewDepartments();
        //         });
        //     });
        // });
        // };
          
          const removeDepartment = () => {
            const sql = `SELECT * FROM department`
            db.query(sql, (err, rows) => {
              if (err) {
                console.log(err);
              }
              const departments = rows.map(({name, id}) => ({name: name, value: id}));
              inquirer.prompt([
                {
                  type: "list",
                  name: "department",
                  message: "Which department would you like to remove?",
                  choices: departments
                }
              ])
              .then(selectDept => {
                const department = selectDept.department
                const params = department;
                const sql = `DELETE FROM department
                              WHERE id = department.id`
                db.query(sql, params, (err) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log("Department deleted!");
                  viewDepartments();
                });
            });
        });
        };
          
//           const removeRole = () => {
//             const sql = `SELECT id, title FROM role`
//             db.query(sql, (err, rows) => {
//               if (err) {
//                 console.log(err);
//               }
//               const roles = rows.map(({title, id}) => ({name: title, value: id}));
//               inquirer.prompt([
//                 {
//                   type: "list",
//                   name: "role",
//                   message: "Which role would you like to remove?",
//                   choices: roles
//                 }
//               ])
//               .then(selectRole => {
//                 const role = selectRole.role
//                 const params = role;
//                 const sql = `DELETE FROM roles
//                               WHERE id = ?`
//                 db.query(sql, params, (err) => {
//                   if (err) {
//                     console.log(err);
//                   }
//                   console.log("Role deleted!");
//                   viewRoles();
//                 });
//             });
//         });
//         };
          
//           const removeEmployee = () => {
//             const sql = `SELECT first_name, last_name, id FROM employee`
//             db.query(sql, (err, rows) => {
//               if (err) {
//                console.log(err);
//               }
//               const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
//               inquirer.prompt([
//                 {
//                   type: "list",
//                   name: "employee",
//                   message: "Which employee would you like to remove?",
//                   choices: employees
//                 }
//               ])
//               .then(selectEmp => {
//                 const employee = selectEmp.employees
//                 const params = employee;
//                 const sql = `DELETE FROM employee
//                               WHERE id = ?`
//                 db.query(sql, params, (err) => {
//                   if (err) {
//                     console.log(err);
//                   }
//                   console.log("Employee removed!");
//                   viewAllEmployees();
//                 });
//               });
//             });
//           };
 

initialQs();
