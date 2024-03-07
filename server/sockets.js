// sockets.js
import { Server } from 'socket.io';

let nombreSesionActual = '';
let usuarios = [];
let sesionActiva = false;
let tareaActual = '';
let cartaSeleccionadaAdmin = null; 

const socketLogic = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://192.168.20.103:5173',
    }
});

  io.on('connection', (socket) => {

    socket.emit('estado-sesion', sesionActiva);

    socket.on('solicitar-estado-sesion', () => {
      socket.emit('estado-sesion', sesionActiva);
    });

    socket.on('crear-sesion', (nombreSesion) => {
      sesionActiva = true;
      io.emit('sesion-disponible');
      io.emit('estado-sesion', sesionActiva); 
      io.emit('sesion-creada', nombreSesion); 
    });
  
    socket.on('cerrarSesion', (data) => {
      usuarios = [];
      sesionActiva = false;
      io.emit('cerrarSesion');
    });

    socket.on('usuarioConectado', (usuario) => {
      let usuarioYaExiste = usuarios.some(u => u.id === usuario.id && u.nombre === usuario.nombre && u.rol === usuario.rol);
      if (!usuarioYaExiste) {
        usuarios.push(usuario);
      }
      io.emit('actualizarUsuarios', usuarios);
    });

    socket.on('usuarioSalio', (usuario) => {
      let indiceUsuario = usuarios.findIndex(u => u.id === usuario.id && u.nombre === usuario.nombre && u.rol === usuario.rol);
      if (indiceUsuario !== -1) {
        usuarios.splice(indiceUsuario, 1);
      }
      io.emit('actualizarUsuarios', usuarios);
    });

    socket.emit('estado-sesion', sesionActiva);

    socket.on('tareaActualizada', (tarea) => {
      tareaActual = tarea;
      io.emit('actualizarTarea', tareaActual);
    });

    socket.on('tareaActualizada', (tarea) => {
      tareaActual = tarea;
      io.emit('actualizarTarea', tareaActual);
    });

    socket.on('usuariosActualizados', (usuariosActualizados) => {
      usuarios = usuariosActualizados;
      io.emit('actualizarUsuarios', usuarios);
    });

    socket.on('revelarCartas', () => {
      io.emit('revelarCartas');
    });

    socket.on('reset', () => {
      usuarios = usuarios.map(usuario => ({ ...usuario, isSelected: false, cardSelected: null }));
      cartaSeleccionadaAdmin = null;
      io.emit('usuariosActualizados', usuarios);
      io.emit('reset');
      io.emit('cartaSeleccionadaAdminCambiada', cartaSeleccionadaAdmin);
    });
    
    socket.on('cartaSeleccionadaAdmin', (carta) => {
      console.log(carta);
      cartaSeleccionadaAdmin = carta;
      io.emit('cartaSeleccionadaAdmin', cartaSeleccionadaAdmin);
    });

    socket.on('cartaSeleccionadaAdminCambiada', (carta) => {
      io.emit('cartaSeleccionadaAdminCambiada', carta);
    });
});
  return io;
};

export default socketLogic;