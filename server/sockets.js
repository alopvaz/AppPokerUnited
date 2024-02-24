// sockets.js
import { Server } from 'socket.io';

let nombreSesionActual = '';
let usuarios = [];
let sesionActiva = false;
let tareaActual = '';



const socketLogic = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    }
  });

  io.on('connection', (socket) => {

    socket.on('crear-sesion', () => {
      sesionActiva = true;
      io.emit('sesion-disponible');
    });
  
    socket.on('cerrarSesion', (data) => {
      // Limpiar la lista de usuarios en el servidor
      usuarios = [];
      sesionActiva = false;
      // Emitir el evento 'cerrarSesion' a todos los sockets conectados
      io.emit('cerrarSesion');
    });

    socket.on('usuarioConectado', (usuario) => {
      // Comprobar si el usuario ya está en la lista
      let usuarioYaExiste = usuarios.some(u => u.nombre === usuario.nombre && u.rol === usuario.rol);
    
      // Si el usuario no está en la lista, añadirlo
      if (!usuarioYaExiste) {
        usuarios.push(usuario);
      }
    
      // Emitir un evento a todos los clientes con la lista actualizada de usuarios
      io.emit('actualizarUsuarios', usuarios);
    });

    socket.on('usuarioSalio', (usuario) => {
      // Encontrar el índice del usuario en la lista
      let indiceUsuario = usuarios.findIndex(u => u.nombre === usuario.nombre && u.rol === usuario.rol);
    
      // Si el usuario se encuentra en la lista, eliminarlo
      if (indiceUsuario !== -1) {
        usuarios.splice(indiceUsuario, 1);
      }
    
      // Emitir un evento a todos los clientes con la lista actualizada de usuarios
      io.emit('actualizarUsuarios', usuarios);
    });

    socket.emit('estado-sesion', sesionActiva);

    socket.on('tareaActualizada', (tarea) => {
      io.emit('actualizarTarea', tarea);
    });

    socket.on('tareaActualizada', (tarea) => {
      // Actualizar la tarea actual
      tareaActual = tarea;
      // Emitir el evento 'actualizarTarea' a todos los clientes
      io.emit('actualizarTarea', tareaActual);
    });
    
    /*console.log('a user connected');
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
    
      // Emitir el nombre de la sesión actual a este usuario
      socket.emit('sesion-disponible', nombreSesionActual);
    });

    io.emit('sesion-creada');

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
  // Actualizar el estado de todas las cartas para todos los usuarios
  usuarios.forEach(usuario => {
    usuario.isRevealed = true;
  });

  // Emitir la lista de usuarios actualizada a todos los clientes
  io.emit('usuarios-actuales', usuarios);
});


socket.on('reset-cards', () => {
  // Restablecer el estado de las cartas para todos los usuarios
  usuarios.forEach(usuario => {
    usuario.revealedCard = null;
    usuario.isRevealed = false;
    usuario.hasVoted = false;
    usuario.selectedCard = null; // Añadir esta línea
  });

  // Emitir la lista de usuarios actualizada a todos los clientes después de restablecer las cartas
  io.emit('usuarios-actuales', usuarios);
});


socket.on('admin-selected-revealed-card', (card) => {
  // Emitir un nuevo evento a todos los clientes con la carta seleccionada por el administrador
  io.emit('admin-selected-revealed-card', card);
});*/


});
  return io;
};

export default socketLogic;