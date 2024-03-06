// Importar el módulo que contiene la conexión a la base de datos
import con from './conexion.js'; 

// Importar express para crear el router
import express from 'express';

// Creamos el router para definir rutas y luego exportarlo al index.js
var router = express.Router();

import bcrypt from 'bcrypt';

// Ruta de inicio de sesión: cuando se hace una solicitud POST a '/login' se ejecuta la función
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    con.query('SELECT * FROM participantes WHERE usuario = ?', [username], function(err, result) {
        if (err) throw err;

        if (result.length === 0) {
            res.json({ status: 'UserNotFound', message: 'No encontramos ninguna cuenta con ese nombre de usuario.' });
        } else {
            // Comparamos la contraseña proporcionada con la versión codificada en la base de datos
            bcrypt.compare(password, result[0].contrasena, function(err, isMatch) {
                if (err) {
                    throw err;
                } else if (!isMatch) {
                    res.json({ status: 'IncorrectPassword', message: 'La contraseña no es correcta.' });
                } else {
                    req.session.role = result[0].rol;
                    req.session.name = result[0].nombre;
                    req.session.userId = result[0].id;
                    console.log("Se ha conectado el usuario " + req.session.name + " con el rol " + req.session.role + " y el ID " + req.session.userId);
                    res.json({ status: 'OK' });
                }
            });
        }
    });
});

// Ruta que responde con el rol del usuario que ha iniciado sesión
router.get('/role', function(req, res) {
    if (req.session.role) {
        res.send(req.session.role) // Envía el rol del usuario
    } else {
        res.status(401).send('No autorizado')
    }
});

// Ruta que responde con el nombre del usuario que ha iniciado sesión
router.get('/name', function(req, res) {
    if (req.session.name) {
        res.send(req.session.name) // Envía el nombre del usuario
    } else {
        res.status(401).send('No autorizado')
    }
});

// Ruta que responde con el ID del usuario que ha iniciado sesión
router.get('/userId', function(req, res) {
    if (req.session.userId) {
        res.send(req.session.userId.toString()) // Envía el ID del usuario
    } else {
        res.status(401).send('No autorizado')
    }
});

router.post('/crear-sesion', function(req, res) {
    var nombreSesion = req.body.nombreSesion;
    var fechaHora = new Date();
    fechaHora.setHours(fechaHora.getHours() + 1); // Ajusta la hora a tu zona horaria

    // Convertir la fecha a un formato que MySQL pueda interpretar
    var fechaHoraMySQL = fechaHora.toISOString().slice(0, 19).replace('T', ' ');

    con.query('INSERT INTO sesiones (nombre, fecha) VALUES (?, ?)', [nombreSesion, fechaHoraMySQL], function(err, result) {
      if (err) throw err;
      res.send({ message: 'Sesión creada con éxito', sessionId: result.insertId }); // Devuelve el ID de la sesión recién creada
    });
});


router.post('/crear-tarea', function(req, res) {
    var nombreTarea = req.body.nombreTarea;
    var estimacion = req.body.estimacion;
    var sessionId = req.body.sessionId;

    con.query('INSERT INTO tareas (nombre, estimacion, idSesion) VALUES (?, ?, ?)', [nombreTarea, estimacion, sessionId], function(err, result) {
        if (err) throw err;
        res.send({ message: 'Tarea creada con éxito', taskId: result.insertId }); // Devuelve el ID de la tarea recién creada
});

router.post('/crear-votacion', function(req, res) {
    var taskId = req.body.taskId;
    var userId = req.body.userId;
    var vote = req.body.vote;

    con.query('INSERT INTO votaciones (idTarea, idUsuario, votacion) VALUES (?, ?, ?)', [taskId, userId, vote], function(err, result) {
        if (err) throw err;
        res.send({ message: 'Votación creada con éxito', voteId: result.insertId }); // Devuelve el ID de la votación recién creada
    });
});
});

// Exportamos el router para usarlo en otros archivos
export default router;

