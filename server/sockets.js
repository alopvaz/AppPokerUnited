// sockets.js
import { Server } from 'socket.io';

let nombreSesionActual = '';

const socketLogic = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    }
  });
  
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('unirse-a-sesion', () => {
      socket.emit('sesion-disponible', nombreSesionActual);
    });

    socket.on('crear-sesion', (nombreSesion) => {
      nombreSesionActual = nombreSesion;
      io.emit('sesion-disponible', nombreSesionActual);
    });

    socket.on('actualizar-tarea', (nuevaTarea) => {
      io.emit('tarea-actualizada', nuevaTarea);
    });

    socket.on('unirse-a-sesion', (nombreUsuario) => {
      io.emit('nuevo-usuario', nombreUsuario);
    });
  });

  return io;
};

export default socketLogic;