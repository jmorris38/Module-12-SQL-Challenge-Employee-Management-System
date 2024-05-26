-- Seeds data for the employee_db database --
INSERT INTO department (department_name)
VALUES ('Supply Chain'),
       ('Procurement'),
       ('Operations');
-- Seeds data for the role table by inserting values into the department_id, title, and salary fields --
INSERT INTO role (department_id, title, salary)
VALUES (1, 'Demand Manager', 100000),
       (1, 'Supply Chain Associate', 40000),
       (2, 'Procurement Manager', 95000),
       (2, 'Procurement Associate', 37500),
       (3, 'Operations Manager', 110000),
       (3, 'Operations Associate', 47500);
-- Seeds data for the employee table by inserting values into the first_name, last_name, role_id, and manager_id fields --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Justin', 'Morris', 1, NULL),
       ('Bob', 'Hamper', 2, 1),
       ('Paul', 'Lane', 3, NULL),
       ('James', 'Sheldon', 4, 3),
       ('Dom', 'Gingham', 5, NULL),
       ('Mia', 'Reynolds', 6, 5);