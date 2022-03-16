-- SQLite

-- Question para teste
INSERT INTO question (id, contest_id, type, description, options, scores, `order`)
VALUES (1, 2, "Texto", "Pergunta 1", NULL, NULL, 1);

-- update para teste, colocar contest queestion state para "Por preencher"
UPDATE contest 
SET questions_state = 'Por preencher'
where id=2;

INSERT INTO user (id, nome, email, password, active) 
VALUES (1, "Tiago Candeias", "tiagompcandeias@gmail.com", "12345", true),
(2, "Tiago As", "tiagoas@gmail.com", "12345", true),
(3, "Tiago", "tiagoasaas@gmail.com", "12345", true),
(4, "Candeias", "candeias@gmail.com", "12345", true),
(5, "Joaquim", "Joaquim@email.com", "12345", true);

INSERT INTO role (id, name, description) 
VALUES (1, "admin", "Admin"),
(2, "juri", "Juri"),
(3, "guest", "Guest"),
(4, "user", "User");

INSERT INTO role_user (user_id, role_id) 
VALUES (1,1),
(2,2),
(5,2),
(3,2),
(4,4);

