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
        hasVoted: false, 
      };
    
      // Verificar si el usuario ya está en la lista
      const usuarioExistente = usuarios.find(usuario => usuario.nombre === nombreUsuario);
    
      // Si el usuario ya existe, actualizar su información
      if (usuarioExistente) {
        usuarioExistente.isRevealed = nuevoUsuario.isRevealed;
        usuarioExistente.revealedCard = nuevoUsuario.revealedCard;
      } else {
        // Si el usuario no existe, agregarlo a la lista
        usuarios.push(nuevoUsuario);
    
        // Emitir la lista de usuarios actuales a todos los usuarios
        io.emit('usuarios-actuales', usuarios);
    
        // Notificar a los demás usuarios sobre el nuevo usuario
        io.emit('nuevo-usuario', nombreUsuario); // Modificado para emitir a todos los usuarios
      }
    
      socket.nombreUsuario = nombreUsuario;
    });

    socket.on('crear-sesion', (nombreSesion) => {
      nombreSesionActual = nombreSesion;
      io.emit('sesion-disponible', nombreSesionActual);
    });z
  
    socket.on('actualizar-tarea', (nuevaTarea) => {
      io.emit('tarea-actualizada', nuevaTarea);
    });
  
   socket.on('disconnect', () => {
  // Eliminar el usuario de la lista
  usuarios = usuarios.filter(usuario => usuario.nombre !== socket.nombreUsuario);

  // Emitir la lista de usuarios actuales a todos los usuarios
  io.emit('usuarios-actuales', usuarios);

  // Notificar a los demás usuarios que el usuario ha dejado la sesión
  io.emit('usuario-desconectado', socket.nombreUsuario); // Modificado para emitir a todos los usuarios
});

socket.on('usuario-votado', ({ nombre, revealedCard }) => {
  const usuarioVotado = usuarios.find(usuario => usuario.nombre === nombre);
  if (usuarioVotado) {
    usuarioVotado.isRevealed = true; // Esta línea podría ser opcional, dependiendo de si quieres revelar la carta ahora o más tarde.
    usuarioVotado.revealedCard = revealedCard;
    usuarioVotado.hasVoted = true; // Actualiza que el usuario ha votado.

    // Aquí está el cambio clave: asegúrate de emitir la lista completa de usuarios actualizada.
    io.emit('usuarios-actuales', usuarios); // Esto asegura que todos los clientes reciban la lista actualizada.
    io.emit('usuario-votado', nombre); // Esto asegura que todos los clientes reciban la lista actualizada.

  }
});

socket.on('reveal-all-cards', () => {
  io.emit('reveal-all-cards');
});


  })
  
  return io;
};

export default socketLogic;