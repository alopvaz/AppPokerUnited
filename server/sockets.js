// sockets.js
import { Server } from 'socket.io';

let nombreSesionActual = '';
let usuarios = [];
let sesionActiva = false;
let tareaActual = '';
let cartaSeleccionadaAdmin = null; // Añade esta línea al inicio de tu archivo

const socketLogic = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    }
  });

  io.on('connection', (socket) => {

    socket.emit('estado-sesion', sesionActiva);

    socket.on('solicitar-estado-sesion', () => {
      socket.emit('estado-sesion', sesionActiva);
    });

    socket.on('crear-sesion', () => {
      sesionActiva = true;
      io.emit('sesion-disponible');
      io.emit('estado-sesion', sesionActiva); // Emitir el estado de la sesión cuando cambia
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

    socket.on('usuariosActualizados', (usuariosActualizados) => {
      // Actualizar la lista completa de usuarios
      usuarios = usuariosActualizados;
      // Emitir un evento a todos los clientes con la lista actualizada de usuarios
      io.emit('actualizarUsuarios', usuarios);
    });

    socket.on('revelarCartas', () => {
      io.emit('revelarCartas');
    });

    socket.on('reset', () => {
      // Restablecer el estado de los usuarios
      usuarios = usuarios.map(usuario => ({ ...usuario, isSelected: false, cardSelected: null }));
    
      // Restablecer la carta seleccionada por el administrador
      cartaSeleccionadaAdmin = null;
    
      // Emitir un evento de 'usuariosActualizados' con la lista de usuarios actualizada
      io.emit('usuariosActualizados', usuarios);
    
      // Emitir un evento de 'reset' para indicar que se ha hecho clic en el botón de resetear
      io.emit('reset');
    
      // Emitir un evento a todos los clientes para informarles que la carta seleccionada por el administrador ha cambiado
      io.emit('cartaSeleccionadaAdminCambiada', cartaSeleccionadaAdmin);
    });
    
    socket.on('cartaSeleccionadaAdmin', (carta) => {
      console.log(carta);
      cartaSeleccionadaAdmin = carta;
      io.emit('cartaSeleccionadaAdmin', cartaSeleccionadaAdmin);
    });

    socket.on('cartaSeleccionadaAdminCambiada', (carta) => {
      // Emitir un evento a todos los clientes para informarles que la carta seleccionada por el administrador ha cambiado
      io.emit('cartaSeleccionadaAdminCambiada', carta);
    });
});
  return io;
};

export default socketLogic;