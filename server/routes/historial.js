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

// Exportamos el router para usarlo en otros archivos
export default router;