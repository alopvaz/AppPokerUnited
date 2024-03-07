CREATE TABLE participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    usuario VARCHAR(255),
    contrasena VARCHAR(255),
    rol ENUM('user', 'admin')
);

CREATE TABLE sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    fecha DATETIME
);

CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    estimacion VARCHAR(255),
    idSesion INT,
    FOREIGN KEY (idSesion) REFERENCES sesiones(id) ON DELETE CASCADE
);

CREATE TABLE votaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idTarea INT,
    votacion VARCHAR(255),
    FOREIGN KEY (idUsuario) REFERENCES participantes(id) ON DELETE CASCADE,
    FOREIGN KEY (idTarea) REFERENCES tareas(id) ON DELETE CASCADE
);

INSERT INTO participantes (nombre, usuario, contrasena, rol) VALUES
('Juan Carlos', 'jcarlos', '$2b$10$g0NzNzX6YFzA91GXw8.82udEDhJ4T3PfFlo0clO9c054tS4Lr8m/W', 'admin'),
('Alicia', 'alicia', '$2b$10$.V/cajtVq5rrAK2WYWM5gO6gbZ8XC02DNRJ3vcJRkfBmKy5uqAkTG', 'user'),
('Álvaro', 'alvaro', '$2b$10$QSWSozGR6WWp4E8kloxBr.WKTIDfKXOWeqAE9zpAovOoY27gX1AAq', 'user'),
('Dani', 'dani', '$2b$10$bT5DjHU6bUL9sqyF4Xo.UO695Cy1eAz/1wpQTPT9SsYpP9TE2kj7a', 'user'),
('Jaime', 'jaime', '$2b$10$M4KV3.wJ/vufzCotT0PVLOlvybGl0bK2RDXhgHT3WKFqgOI0gu2IK', 'user'),
('Jorge', 'jorge', '$2b$10$NDyrszMECXEZ.pmdwuVmWuvHRWPgpICZY1WdN9kJmaq4OWoV1fPJa', 'user'),
('Javi', 'javi', '$2b$10$rdBQKt/fDzCwfRMtB83a2u.mE0V1a567K/oV.FmnDbfZdkoF9/2iW', 'user'),
('Coral', 'coral', '$2b$10$/e926F.dACWpii7at4zILOsayh0SNu/gPTPY0IkjpGyeyFtdBvGLC', 'user'),
('Simon', 'simon', '$2b$10$C2MdxPGeHg69wdN40QMOlOPn9Lsw2PyLkMWkbqnyoCGRhY54ULcpq', 'user'),
('Vero', 'vero', '$2b$10$9so8K9zzU.5UfnzmKWeB3u8uJs5HgEqBJttpdy6iNPhEVW5oSyMIu', 'user'),
('Félix', 'felix', '$2b$10$EP294B1/PL.dcLiqufeO.OvpuKw8tJaN6PQV9jRqTddcXI8Ypyu7i', 'user');