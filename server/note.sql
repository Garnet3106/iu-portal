CREATE TABLE assignment (id CHAR(36), registrar_id TEXT, registered_at TIMESTAMP, course_id CHAR(36), lecture_id CHAR(36), assigned_from CHAR(36), submit_to CHAR(36), deadline TIMESTAMP, description TEXT, note TEXT, PRIMARY KEY (id)) DEFAULT CHARSET=utf8mb4;
INSERT INTO assignment (id, registrar_id, registered_at, course_id, lecture_id, assigned_from, submit_to, deadline, description, note) VALUES (UUID(), NOW(), UUID(), UUID(), "UNIPA", "Classroom", NOW(), "desc", "notes");

CREATE TABLE course (id CHAR(36), registered_at TIMESTAMP, code TEXT, name TEXT, election_kind ENUM('required', 'electively_required', 'elective'), number_of_credit INT, year INT, grade INT, semester ENUM('first', 'second'), teacher_ids TEXT) DEFAULT CHARSET=utf8mb4;
INSERT INTO course (id, registered_at, code, name, election_kind, number_of_credit, year, grade, semester, teacher_ids) VALUES (UUID(), NOW(), 'MK11220002', 'マーケティング基礎', 'required', 2, 2022, 1, 'first', UUID());
