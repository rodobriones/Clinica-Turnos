-- ===============================================
--   CREACIÓN DE BASE DE DATOS
-- ===============================================

DROP DATABASE IF EXISTS hospital_turnos;
CREATE DATABASE hospital_turnos;
USE hospital_turnos;


-- ===============================================
--   TABLA: clinica
-- ===============================================

CREATE TABLE clinica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);


-- ===============================================
--   TABLA: paciente
-- ===============================================

CREATE TABLE paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL
);


-- ===============================================
--   TABLA: turno
-- ===============================================
-- Un turno pertenece a un paciente y a una clínica.
-- El número de turno por clínica es FIJO y NO se recalcula.
-- Cuando alguien se mueve de clínica, solo a él se le asigna un nuevo número.

CREATE TABLE turno (
    id INT AUTO_INCREMENT PRIMARY KEY,

    paciente_id INT NOT NULL,
    clinica_id INT NOT NULL,

    fecha_hora DATETIME NOT NULL,

    -- Número de turno FIJO dentro de la clínica
    numero_turno_clinica INT NOT NULL,

    created_at DATETIME NOT NULL DEFAULT NOW(),
    updated_at DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    FOREIGN KEY (clinica_id) REFERENCES clinica(id)
);


-- ===============================================
--   TABLA: turno_reasignacion (historial)
-- ===============================================
-- Guarda cada cambio de clínica y el motivo.

CREATE TABLE turno_reasignacion (
    id INT AUTO_INCREMENT PRIMARY KEY,

    turno_id INT NOT NULL,
    clinica_anterior_id INT NOT NULL,
    clinica_nueva_id INT NOT NULL,
    motivo TEXT NOT NULL,

    fecha_hora DATETIME NOT NULL DEFAULT NOW(),

    FOREIGN KEY (turno_id) REFERENCES turno(id),
    FOREIGN KEY (clinica_anterior_id) REFERENCES clinica(id),
    FOREIGN KEY (clinica_nueva_id)  REFERENCES clinica(id)
);


-- ===============================================
--   DATOS DE EJEMPLO
-- ===============================================

INSERT INTO clinica (nombre) VALUES
('Traumatología'),
('Pediatría'),
('Dermatología');

INSERT INTO paciente (nombre) VALUES
('Juan Pérez'),
('María López'),
('Carlos Gómez');


INSERT INTO turno (paciente_id, clinica_id, fecha_hora, numero_turno_clinica)
VALUES
(1, 1, '2025-11-15 09:00', 1),
(2, 2, '2025-11-15 10:00', 1),
(3, 2, '2025-11-15 11:00', 2);

