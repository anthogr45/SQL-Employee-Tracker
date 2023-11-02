USE employee_db;

INSERT INTO department (id, dname)
values (01, "Finance"),
       (02, "Administration"),
       (03, "IT"),
       (04, "HR"),
       (05, "Legal"),
       (06, "Operations");


INSERT INTO e_role (id, title, salary, department_id)
values (001, "IT Project Manager", 120000, 03),
       (003, "HR EXECUTIVE", 60000, 04),
       (004, "HR Manager", 120000, 04),
       (007, "Front Desk Executive", 50000, 06),
       (008, "Operations Manager", 140000, 06),
       (009, "Admin Cleark", 50000, 02),
       (010, "Admin Manager", 100000, 02);
    

INSERT INTO employee ( id, first_name, last_name, role_id, manager_id)
values (121, "Tyler", "Fernando", 001, 131),
       (131, "Colin", "Land", 008, 151),
       (125, "Daren", "Faith", 007, 131),
       (141, "Steff", "Silva", 003, 148 ),
       (148, "Desmon", "Silva", 004, 151),
       (161, "Chris", "Croft", 009, 167),
       (167, "Mason", "Kelly", 010, 151);


