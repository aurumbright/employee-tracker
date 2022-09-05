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


INSERT INTO employees (first_name, last_name, role_id, manager)
    VALUES ('Jan', 'Brown', 1, NULL),
            ('Mike', 'Smith', 2, 'Jan Brown'),
            ('Derek', 'Robertson', 3, 'Jan Brown'),
            ('Jennifer', 'James', 4, 'Mike Smith'),
            ('Mikaela', 'Morris', 5, 'Amber Michaelson'),
            ('Amber', 'Michaelson', 6, 'Jan Brown');