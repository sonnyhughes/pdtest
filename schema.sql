USE sandbox_db;


INSERT INTO Posts (id, body, groupLimit, authorEmail, createdAt, UpdatedAt) VALUES (1, 'I have this wonderful idea for an app', 5, 'm-cody@northwestern.edu', '2015-10-10 10:30:00', '2015-10-10 10:30:00');
INSERT INTO Posts (id, body, groupLimit, authorEmail, createdAt, UpdatedAt) VALUES (2, 'I want to build a Sequelize DB with someone', 6, 'm-cody@northwestern.edu', '2015-10-10 10:30:00', '2015-10-10 10:30:00');
INSERT INTO Posts (id, body, groupLimit, authorEmail, createdAt, UpdatedAt) VALUES (3, 'I create a shopping list app', 3, 'm-cody@northwestern.edu', '2015-10-10 10:30:00', '2015-10-10 10:30:00');
INSERT INTO Posts (id, body, groupLimit, authorEmail, createdAt, UpdatedAt) VALUES (4, 'I create a boolean', 5, 'm-cody@northwestern.edu', '2015-10-10 10:30:00', '2015-10-10 10:30:00' );

INSERT INTO Users (user_name) VALUES ('Mrs.TWO');
INSERT INTO Users (user_name) VALUES ('Mr.ONE');

create database sandbox_db;