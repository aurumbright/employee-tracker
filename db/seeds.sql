INSERT INTO departments (department_name)
    VALUES ('Sales'),
            ('Engineering'),
            ('Marketing');


INSERT INTO company_role (title, salary, department_id)
    VALUES  ('Account Manager', 75000, 1),
            ('Engineer', 75000, 2),
            ('Salesperson', 75000, 1),
            ('Editor', 75000, 3),
            ('Events Director', 75000, 3),
            ('Marketing Manager', 75000, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ('Jan', 'Brown', 1, NULL),
            ('Mike', 'Smith', 2, 1),
            ('Derek', 'Robertson', 3, 1),
            ('Jennifer', 'James', 4, 2),
            ('Mikaela', 'Morris', 5, 6),
            ('Amber', 'Michaelson', 6, 1);