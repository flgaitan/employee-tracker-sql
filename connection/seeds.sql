INSERT INTO department (department_name)
VALUES ("Web Development"),
       ("Data Science"),
       ("Math"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("JavaScript Developer", 50000, 1),
       ("Data Scientist", 50000, 2),
       ("Analyst", 51000, 3),
       ("Marketing Specialist", 55000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Riddle", 3, NULL), 
       ("Ron", "Rogue", 4, NULL),
       ("Jack", "Frost", 3, 1),
       ("Saint", "Claus", 4, 2);
      