DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL, 
  salary INT NOT NULL,
  department_id INT,

  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
); 

CREATE TABLE employee (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT, 
    manager_id INT,

    
    FOREIGN KEY (role_id) 
    REFERENCES role(id),  
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id) 
);

