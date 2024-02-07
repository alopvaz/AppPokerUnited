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
    estimacion INT,
    idSesion INT,
    FOREIGN KEY (idSesion) REFERENCES sesiones(id)
);

CREATE TABLE votaciones (
    idUsuario INT,
    idTarea INT,
    votacion INT,
    FOREIGN KEY (idUsuario) REFERENCES participantes(id),
    FOREIGN KEY (idTarea) REFERENCES tareas(id)
);
