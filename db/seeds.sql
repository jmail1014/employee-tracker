USE employees;

INSERT INTO departments ('name')
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO roles (department_id, title, salary)
VALUES
  (1,'Salesperson', 80000),
  (2,'Lead Engineer', 150000),
  (2,'Software Engineer', 120000),
  (3,'Account Manager', 160000),
  (3,'Accountant', 125000),
  (4,'Legal Team Lead', 250000),
  (4,'Lawyer', 190000);

INSERT INTO employees (role_id, first_name, last_name)
VALUES
  (1,'Mike', 'Chan'),
  (2,'Ashley', 'Rodriguez'),
  (3,'Kevin', 'Tupik'),
  (4,'Kunal', 'Singh'),
  (5,'Malia', 'Brown'),
  (6,'Sarah', 'Lourd'),
  (7,'Tom', 'Allen');