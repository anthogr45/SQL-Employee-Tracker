DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL,
  dname VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE e_role (
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
 
);

CREATE TABLE employee (
    id INT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT, 
    PRIMARY key (id),
    FOREIGN KEY (role_id)
    REFERENCES e_role(id)

);