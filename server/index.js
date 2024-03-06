// Importar las librerías necesarias
import express from 'express';
import cors from 'cors';
import http from 'http';
import session from 'express-session';

// Importar las rutas express
import router from './routes.js'; 
import routesHistorial from './routes/historial.js';

//Importar las rutas de sockets
import socketLogic from './sockets.js';  

// Crear una nueva aplicación Express
const app = express();

// Configurar CORS para permitir conexiones desde 'http://localhost:3000'
app.use(cors({
  origin: ['http://192.168.20.103:5173'],
  credentials: true
}));

// Configurar la aplicación para usar JSON y URL encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar la aplicación para usar sesiones
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Usar el router
app.use('/', router); 
app.use('/', routesHistorial);

// Middleware para añadir el rol a las respuestas locales
app.use((req, res, next) => {
  res.locals.role = req.session.role;
  next();
});

// Crear un nuevo servidor HTTP a partir de la aplicación Express
let server = http.createServer(app);

// Crear un nuevo servidor Socket.IO a partir del servidor HTTP usando socketLogic
const io = socketLogic(server, {
  cors: {
    origin: "http://192.168.20.103:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});