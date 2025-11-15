CREATE DATABASE IF NOT EXISTS hospital;
USE hospital;

CREATE TABLE clinica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100)
);

CREATE TABLE paciente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150)
);

CREATE TABLE turno (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT,
  clinica_id INT,
  fecha_hora DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL,
  FOREIGN KEY (paciente_id) REFERENCES paciente(id),
  FOREIGN KEY (clinica_id) REFERENCES clinica(id)
);

CREATE TABLE turno_reasignacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turno_id INT,
  clinica_anterior_id INT,
  clinica_nueva_id INT,
  motivo TEXT,
  fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (turno_id) REFERENCES turno(id)
);

INSERT INTO clinica (nombre) VALUES ('Clínica General'), ('Pediatría'), ('Traumatología');
INSERT INTO paciente (nombre) VALUES ('Juan Pérez'), ('María López'), ('Carlos Gómez');

INSERT INTO turno (paciente_id, clinica_id, fecha_hora)
VALUES (1,1,'2025-11-15 09:00'), (2,2,'2025-11-15 10:00'), (3,1,'2025-11-15 11:00');
