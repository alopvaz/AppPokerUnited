// Importar el módulo que contiene la conexión a la base de datos
import con from '../conexion.js';

// Importar express para crear el router
import express from 'express';

// Creamos el router para definir rutas y luego exportarlo al index.js
var router = express.Router();

// Crea una ruta para obtener las sesiones
router.get('/sesiones', (req, res) => {
    const sql = 'SELECT * FROM sesiones'; // reemplaza 'sesiones' con el nombre de tu tabla
  
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({ error: 'Error fetching data from database' });
      } else {
        console.log(result); // Imprime el resultado en la consola
        res.json(result);
      }
    });
});

// Crea una ruta para obtener las tareas de una sesión específica
router.get('/tareas', (req, res) => {
  const idSesion = req.query.idSesion;
  const sql = `SELECT * FROM tareas WHERE idSesion = ${idSesion}`; 

  con.query(sql, (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching data from database' });
    } else {
      console.log(result); // Imprime el resultado en la consola
      res.json(result);
    }
  });
});

router.get('/votaciones', (req, res) => {
  const idTarea = req.query.idTarea;
  const sql = `SELECT votaciones.*, participantes.nombre 
               FROM votaciones 
               INNER JOIN participantes ON votaciones.idUsuario = participantes.id 
               WHERE votaciones.idTarea = ${idTarea}`; 

  con.query(sql, (err, result) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching data from database' });
    } else {
      res.json(result);
    }
  });
}) ; 

// Controlador de ruta para DELETE /tareas/:id
router.delete('/tareas/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM tareas WHERE id = ?';

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Error deleting data from database' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

// Controlador de ruta para DELETE /votaciones/:id
/*router.delete('/votaciones/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM votaciones WHERE id = ?';

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Error deleting data from database' });
    } else {
      res.json({ message: 'Vote deleted successfully' });
    }
  });
});*/

// Controlador de ruta para PUT /sesiones/:id
router.put('/sesiones/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, fecha } = req.body;
  const sql = 'UPDATE sesiones SET nombre = ?, fecha = ? WHERE id = ?';

  con.query(sql, [nombre, fecha, id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Error updating data in database' });
    } else {
      res.json({ message: 'Session updated successfully' });
    }
  });
});

// Controlador de ruta para PUT /sesiones/:id
router.put('/tareas/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, estimacion } = req.body;
  const sql = 'UPDATE tareas SET nombre = ?, estimacion = ? WHERE id = ?';

  con.query(sql, [nombre, estimacion, id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Error updating data in database' });
    } else {
      res.json({ message: 'Session updated successfully' });
    }
  });
});

// Exportamos el router para usarlo en otros archivos
export default router;