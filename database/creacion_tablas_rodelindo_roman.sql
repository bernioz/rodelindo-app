-- Script de creación de base de datos para Fútbol Club Rodelindo Román
-- Base de datos: PostgreSQL

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Administrador', 'Profesor', 'Apoderado'))
);

CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    nombre_apoderado VARCHAR(255) NOT NULL,
    telefono_apoderado VARCHAR(50) NOT NULL,
    imagen_portada TEXT,
    usuario_apoderado_id INT, -- Conexión para que el apoderado vea a su hijo
    FOREIGN KEY (usuario_apoderado_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE sesiones (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL,
    sesion_id INT NOT NULL,
    presente BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_id) REFERENCES sesiones(id) ON DELETE CASCADE
);

CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL,
    mes INT NOT NULL CHECK (mes >= 1 AND mes <= 12),
    año INT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT FALSE,
    matricula BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
);

CREATE TABLE torneos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    resultado VARCHAR(255)
);

CREATE TABLE torneo_alumnos (
    id SERIAL PRIMARY KEY,
    torneo_id INT NOT NULL,
    alumno_id INT NOT NULL,
    FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
);
