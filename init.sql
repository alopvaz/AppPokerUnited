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
('jcarlos', 'jcarlos', '$2b$10$g0NzNzX6YFzA91GXw8.82udEDhJ4T3PfFlo0clO9c054tS4Lr8m/W', 'admin'),
('alicia', 'alicia', '$2b$10$.V/cajtVq5rrAK2WYWM5gO6gbZ8XC02DNRJ3vcJRkfBmKy5uqAkTG', 'user'),
('alvaro', 'alvaro', '$2b$10$QSWSozGR6WWp4E8kloxBr.WKTIDfKXOWeqAE9zpAovOoY27gX1AAq', 'user');