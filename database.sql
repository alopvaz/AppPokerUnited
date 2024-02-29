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
    FOREIGN KEY (idSesion) REFERENCES sesiones(id)
);

CREATE TABLE votaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idTarea INT,
    votacion VARCHAR(255),
    FOREIGN KEY (idUsuario) REFERENCES participantes(id),
    FOREIGN KEY (idTarea) REFERENCES tareas(id)
);
