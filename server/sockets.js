// sockets.js
import { Server } from 'socket.io';

let nombreSesionActual = '';
let usuarios = [];

const socketLogic = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    }
  });
  
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('unirse-a-sesion', (nombreUsuario) => {
      // Crear un nuevo objeto de usuario
      const nuevoUsuario = {
        nombre: nombreUsuario,
        isRevealed: false,
        revealedCard: null,
      };
    
      // Agregar el nuevo usuario a la lista
      usuarios.push(nuevoUsuario);
    
      socket.nombreUsuario = nombreUsuario;
    
      // Emitir la lista de usuarios actuales a todos los usuarios
      io.emit('usuarios-actuales', usuarios);
    
      // Notificar a los demás usuarios sobre el nuevo usuario
      socket.emit('nuevo-usuario', nombreUsuario);
    });

    socket.on('crear-sesion', (nombreSesion) => {
      nombreSesionActual = nombreSesion;
      io.emit('sesion-disponible', nombreSesionActual);
    });

    socket.on('actualizar-tarea', (nuevaTarea) => {
      io.emit('tarea-actualizada', nuevaTarea);
    });

    socket.on('disconnect', () => {
      // Eliminar el usuario de la lista
      usuarios = usuarios.filter(usuario => usuario.nombre !== socket.nombreUsuario);
    
      // Emitir la lista de usuarios actuales a todos los usuarios
      io.emit('usuarios-actuales', usuarios);
    
      // Notificar a los demás usuarios que el usuario ha dejado la sesión
      socket.emit('usuario-desconectado', socket.nombreUsuario);
    });

    socket.on('usuario-votado', (nombreUsuario) => {
      // Encontrar el usuario que ha votado
      const usuarioVotado = usuarios.find(usuario => usuario.nombre === nombreUsuario);
    
      // Si el usuario existe, actualizar su estado
      if (usuarioVotado) {
        usuarioVotado.hasVoted = true;
    
        // Emitir la lista de usuarios actuales a todos los usuarios
        io.emit('usuarios-actuales', usuarios);
      }
    });
  })

  return io;
};

export default socketLogic;