import React, { useEffect, useState } from 'react';
import './probandoSesion.css';

import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import useLocalStorage from '../../localStorage/useLocalStorage';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoIosExit,IoIosListBox } from "react-icons/io";


// Crear una referencia al elemento textarea

//Importar cartas
import reverso from "./cartas/reverso.png";
import cero from "./cartas/0.png";
import uno from "./cartas/1.png";
import dos from "./cartas/2.png";
import tres from "./cartas/3.png";
import cinco from "./cartas/5.png";
import ocho from "./cartas/8.png";
import trece from "./cartas/13.png";
import veintiuno from "./cartas/21.png";
import treintaycuatro from "./cartas/34.png";
import cincuentaycinco from "./cartas/55.png";
import ochentaynueve from "./cartas/89.png";
import infinito from "./cartas/infinito.png";
import interrogacion from "./cartas/interrogacion.png";

// Crear un array de objetos que contenga las cartas
const cartas = [
  { img: cero, value: 0 },
  { img: uno, value: 1 },
  { img: dos, value: 2 },
  { img: tres, value: 3 },
  { img: cinco, value: 5 },
  { img: ocho, value: 8 },
  { img: trece, value: 13 },
  { img: veintiuno, value: 21 },
  { img: treintaycuatro, value: 34 },
  { img: cincuentaycinco, value: 55 },
  { img: ochentaynueve, value: 89 },
  { img: infinito, value: 'infinito' },
  { img: interrogacion, value: '?' },
];

const socket = io('http://192.168.20.103:3000');

function ProbandoSesion({ setSesionCreada, nombre, rol, id, showNavbar, navVisible }) {

  useEffect(() => {
    showNavbar(navVisible);
  }, [navVisible, showNavbar]);
  
  // Pasar un array vacío como segundo argumento para que el efecto se ejecute solo una vez
  //recupero el id de la sesion
  const location = useLocation();
  let sessionId;
  if (location && location.state) {
    sessionId = location.state.sessionId;
    console.log("SessionId:", sessionId);
  } else {
    // Manejar el caso en que location.state es undefined
  }

  const crearTarea = () => {
    axios.post('http://192.168.20.103:3000/crear-tarea', { 
      nombreTarea: tarea, 
      estimacion: cartaSeleccionadaAdmin, 
      sessionId: sessionId 
    })
    .then(response => {
      console.log(response.data);
      // Extraer el taskId de la respuesta
      const taskId = response.data.taskId;
      // Crear las votaciones
      crearVotaciones(taskId);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  const crearVotaciones = (taskId) => {
    // Suponiendo que usuarios es un array de objetos usuario con propiedades id y cardSelected
    usuarios.forEach(usuario => {
      console.log(`Tarea ID: ${taskId}`);
      console.log(`Usuario ID: ${usuario.id}`);
      console.log(`Votación: ${usuario.cardSelected}`);
      // Aquí puedes hacer un axios.post para crear la votación
      axios.post('http://192.168.20.103:3000/crear-votacion', { taskId, userId: usuario.id, vote: usuario.cardSelected })
      .then(response => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }

  const handleConfirm = () => {
    console.log('Tarea:', tarea);
    console.log('Carta seleccionada por el administrador:', cartaSeleccionadaAdmin);
    console.log('ID de la sesión:', sessionId);
  
    crearTarea();
  
    handleResetClick();
    setTarea("No hay tarea seleccionada");
    socket.emit('tareaActualizada', "No hay tarea seleccionada"); // Emitir el evento aquí
  
    setShowModal(false);
  }

  useEffect(() => {
    socket.on('actualizarTarea', (tarea) => {
      setTarea(tarea);
      setTareaEditable(tarea);
    });
  
    // Recuerda limpiar el evento cuando el componente se desmonte
    return () => {
      socket.off('actualizarTarea');
    };
  }, []);


  const [showModal, setShowModal] = useLocalStorage('showModal', false);
  
  const [cartaSeleccionadaAdmin, setCartaSeleccionadaAdmin] = useLocalStorage('cartaSeleccionadaAdmin', null);
  const handleAdminCardClick  = (usuario) => {
    if (rol === 'admin' && (reveal || (usuario.nombre === nombre && usuario.rol === 'admin'))) {
      if (usuario.cardSelected !== undefined) {
        console.log(`Admin seleccionó la carta: ${usuario.cardSelected}`);
        setCartaSeleccionadaAdmin(usuario.cardSelected);
        console.log(usuario.cardSelected);
        socket.emit('cartaSeleccionadaAdmin', usuario.cardSelected);
        console.log(`Evento 'cartaSeleccionadaAdmin' emitido con carta: ${usuario.cardSelected}`);
      }
    }
  };

 

  useEffect(() => {
    socket.on('cartaSeleccionadaAdmin', (carta) => {
      console.log(`Cliente recibió carta: ${carta}`);
      setCartaSeleccionadaAdmin(carta);
    });
  
    // Limpiar el listener cuando el componente se desmonta
    return () => {
      socket.off('cartaSeleccionadaAdmin');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [reveal, setReveal] = useLocalStorage('reveal', false);  
  const handleReveal = () => {
    setReveal(true);
    console.log(usuarios);
    socket.emit('revelarCartas');
  };

  useEffect(() => {
    // Escuchar el evento 'revelarCartas'
    socket.on('revelarCartas', () => {
      // Actualizar el estado 'reveal' a true
      setReveal(true);
    });
  
    // Limpiar el listener cuando el componente se desmonta
    return () => {
      socket.off('revelarCartas');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencias


  const navigate = useNavigate();

  //Estado que maneja la lista de usuarios conectados
  const [usuarios, setUsuarios] = useLocalStorage('usuarios', []);
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);

  const handleResetClick = () => {
    // Recorrer el array de usuarios y para cada usuario, cambiar su propiedad `isSelected` a `false` y `cardSelected` a `null`
    let usuariosActualizados = usuarios.map(usuario => {
      return { ...usuario, isSelected: false, cardSelected: null };
    });
  
    // Emitir un evento al servidor para actualizar el estado de todos los usuarios
    socket.emit('usuariosActualizados', usuariosActualizados);
  
    // Actualizar el estado local de los usuarios
    setUsuarios(usuariosActualizados);
  
    // Restablecer el estado de 'reveal' a false
    setReveal(false);
    setCartaSeleccionadaAdmin(null);
    

  // Emitir un evento al servidor para informarle que la carta seleccionada por el administrador ha cambiado
      socket.emit('cartaSeleccionadaAdminCambiada', null);

    // Restablecer el estado de 'cartaSeleccionada' a null
    setCartaSeleccionada(null);
  
    // Emitir un evento de 'reset' al servidor
    socket.emit('reset');
  }; 

  useEffect(() => {
    socket.on('cartaSeleccionadaAdminCambiada', (carta) => {
      setCartaSeleccionadaAdmin(carta);
    });
  
    // Limpiar el evento al desmontar el componente
    return () => {
      socket.off('cartaSeleccionadaAdminCambiada');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    // Escuchar el evento 'reset'
    socket.on('reset', () => {
      // Restablecer el estado de 'reveal' a false
      setReveal(false);
  
      // Restablecer el estado de 'cartaSeleccionada' a null
      setCartaSeleccionada(null);
    });
  
    // Escuchar el evento 'usuariosActualizados'
    socket.on('usuariosActualizados', (usuariosActualizados) => {
      // Actualizar el estado de 'usuarios' con la lista de usuarios recibida
      setUsuarios(usuariosActualizados);
    });
  
    // Limpiar los listeners cuando el componente se desmonta
    return () => {
      socket.off('reset');
      socket.off('usuariosActualizados');
    };
  }, []); // Sin dependencias
 
  //Cuando el admin hace click sobre Salir setSesionCreada a false
  const handleFinalizarClickAdmin = () => {
    // Emitir un evento al servidor para hacer que setSesionCreada sea falso
    setUsuarios([]);
    socket.emit('cerrarSesion');
    // Redirigir al admin a la página de crearSesion
    navigate("/crearSesion");
    // Cambiar el estado de setSesionCreada a false
    setSesionCreada(false);
    // Restablecer la tarea a "No hay tarea seleccionada"
    setTarea("No hay tarea seleccionada");
  };
  
  useEffect(() => {
    // Cuando se recibe el evento 'cerrarSesion', desconectar a todos los usuarios
    socket.on('cerrarSesion', () => {
      // Limpiar el localStorage
      setUsuarios([]);
      // Cambiar el estado de setSesionCreada a false
      setSesionCreada(false);
      // Redirigir al usuario a la página de inicio
      navigate("/crearSesion");
    });
  
    // Limpiar el listener cuando el componente se desmonta
    return () => {
      socket.off('cerrarSesion');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    // Escuchar el evento 'actualizarUsuarios'
    socket.on('actualizarUsuarios', (usuariosActualizados) => {
      // Actualizar el estado de 'usuarios' con la lista de usuarios recibida
      setUsuarios(usuariosActualizados);
  
      // Encuentra el usuario actual en la lista de usuarios actualizados
      let usuarioActualizado = usuariosActualizados.find(usuario => usuario.id === id);
      if (usuarioActualizado) {
        // Actualizar el estado de 'cartaSeleccionada' con el valor de 'cardSelected' del usuario actualizado
        setCartaSeleccionada(usuarioActualizado.cardSelected);
      }
    });
  
    // Limpiar el listener cuando el componente se desmonta
    return () => {
      socket.off('actualizarUsuarios');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Añade 'id' a la lista de dependencias del useEffect 
  
  // Sin dependencias
  useEffect(() => {
    socket.emit('usuarioConectado', {id, nombre, rol, isSelected: false, cardSelected: null });
    console.log('usuarioConectado', id, nombre, rol);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
const handleSalirClick = () => {
  // Obtener la lista actual de usuarios del localStorage
  let usuariosActuales = [...usuarios];
  // Encontrar el índice del usuario en la lista
  let indiceUsuario = usuariosActuales.findIndex(usuario => usuario.id === id);  // Si el usuario se encuentra en la lista, eliminarlo
  if (indiceUsuario !== -1) {
    usuariosActuales.splice(indiceUsuario, 1);
  }
  // Actualizar la lista de usuarios en el localStorage
  setUsuarios(usuariosActuales);
  // Emitir un evento al servidor para indicar que el usuario ha salido de la sesión
  socket.emit('usuarioSalio', {id, nombre, rol });
  // Redirigir al usuario a la página de inicio
  navigate("/crearSesion");
  // Restablecer la tarea a "No hay tarea seleccionada"
};


// Encuentra el usuario actual en el array
let index = usuarios.findIndex(usuario => usuario.nombre === nombre && usuario.rol === rol);
if (index !== -1) {
  // Suponiendo que 'usuarioActual' es el usuario actual
  let usuarioActual = {
    id: id,
    nombre: nombre,
    rol: rol,
    isSelected: usuarios[index].isSelected || false,
    cardSelected: usuarios[index].cardSelected || null
  }; // reemplaza esto con el usuario actual
  // Elimina el usuario actual del array
  usuarios.splice(index, 1);
  // Añade el nuevo usuario al principio del array
  usuarios.unshift(usuarioActual);
}

    const [tarea, setTarea] = useLocalStorage('tarea', "No hay tarea seleccionada");
    const [tareaEditable, setTareaEditable] = useState(tarea);
    const handleGuardarClick = () => {
      // Emitir el evento solo cuando se hace clic en "Guardar"
      socket.emit('tareaActualizada', tareaEditable);
      setTarea(tareaEditable);
      setTareaEditable(tareaEditable); // Añade esta línea
      // Cambiar el estado de isTextareaEnabled a false
      setTextareaEnabled(false);
    };

    const [isTextareaEnabled, setTextareaEnabled] = React.useState(false);
    const tareaRef = React.useRef();


    const handleEditarClick = () => {
      // Habilitar el textarea cuando se hace click en "Editar"
      setTextareaEnabled(true);
    
      // Si la tarea actual es "No hay tarea seleccionada", borrarla
      if (tarea === "No hay tarea seleccionada") {
        setTarea("");
        setTareaEditable(""); // Añade esta línea
      }
    
      // Enfocar el textarea
      // Usar setTimeout para asegurarse de que el textarea esté listo para recibir el foco
      setTimeout(() => {
        tareaRef.current.focus();
      }, 0);
    };

// Función para manejar el clic en la carta
const handleCardClick = (e) => {
  // Obtener el valor de la carta del atributo 'data-value'
  const cardValue = e.target.getAttribute('data-value');
  // Imprimir el valor de la carta en la consola
  console.log(cardValue);

  // Quitar la clase 'raised' de todas las cartas
  const cards = document.querySelectorAll('.carta-pequena');
  cards.forEach(card => card.classList.remove('raised'));

  // Agregar la clase 'raised' a la carta en la que se hizo clic
  e.target.classList.add('raised');

  // Actualizar el estado del usuario actual
  let usuariosActuales = [...usuarios];
  let usuarioActualIndex = usuariosActuales.findIndex(usuario => usuario.nombre === nombre && usuario.rol === rol && usuario.id === id);
  if (usuarioActualIndex !== -1) {
    let usuarioActual = { ...usuariosActuales[usuarioActualIndex] };
    usuarioActual.isSelected = true;
    usuarioActual.cardSelected = cardValue;
    usuariosActuales[usuarioActualIndex] = usuarioActual;

    // Actualiza el estado de la carta seleccionada con el valor de la carta del usuario actual
    setCartaSeleccionada(cardValue);
  }

  console.log(usuariosActuales);
setUsuarios(usuariosActuales);

// Emitir un evento al servidor para actualizar el estado del usuario
socket.emit('usuariosActualizados', usuariosActuales);
};


useEffect(() => {
  // Escuchar el evento 'actualizarTarea'
  socket.on('actualizarTarea', (tareaActualizada) => {
    console.log('actualizarTarea', tareaActualizada);
    // Actualizar el estado de 'tarea' y 'tareaEditable' con la tarea recibida
    setTarea(tareaActualizada);
    setTareaEditable(tareaActualizada);
  });

  // Limpiar el listener cuando el componente se desmonta
  return () => {
    socket.off('actualizarTarea');
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Sin dependencias
    
const handleButtonClick = () => {
  if (isTextareaEnabled) {
    handleGuardarClick();
  } else {
    handleEditarClick();
  }
};

  return (

    <div className="bodyStyle">

   {rol === 'admin' &&
    
      <button className="exit-button" onClick={handleFinalizarClickAdmin}>
        <IoIosExit size={35} style={{ marginRight: '5px' }} /> 
      </button>
      }
    {rol !== 'admin' && 
      <button className="exit-button" onClick={handleSalirClick}>
        <IoIosExit size={35} style={{ marginRight: '5px' }} /> 
      </button>}
 <div className="container">
        <div className="left-div"> 
        
         <div className="div-lista">
        <ul>
        {usuarios.map((usuario, index) => (
  <li key={index}>
    <div className="card-item">
      <img 
        className={usuario.isSelected ? 'card-selected' : ''}
        src={
          (usuario.nombre === nombre && usuario.rol === rol && cartaSeleccionada) || (reveal && usuario.isSelected)
          ? (cartas.find(carta => carta.value.toString() === (usuario.cardSelected || cartaSeleccionada).toString()) || {}).img || reverso
          : reverso
        } 
        alt={
          (usuario.nombre === nombre && usuario.rol === rol && cartaSeleccionada) || (reveal && usuario.isSelected)
          ? `Carta ${(usuario.cardSelected || cartaSeleccionada)}`
          : "Imagen 1"
        } 
        onClick={() => handleAdminCardClick(usuario)}
      />
      <div className={`card-name ${usuario.isSelected ? 'nombre-usuario-seleccionado' : ''}`}>{usuario.nombre}</div>   
    </div>
  </li>
))}
    </ul>
        </div>
        <div className="div-restante">
          {tarea !== "No hay tarea seleccionada" && !reveal && cartas.map((carta, index) => (
            <img className='carta-pequena' key={index} src={carta.img} alt={`Carta ${carta.value}`} data-value={carta.value} onClick={handleCardClick} />
          ))}
          {reveal && cartaSeleccionadaAdmin && (
            <img className='carta-pequena animated-card' 
       src={(cartas.find(carta => carta.value.toString() === cartaSeleccionadaAdmin.toString()) || {}).img || reverso} 
       alt={`Carta ${cartaSeleccionadaAdmin}`} 
       data-value={cartaSeleccionadaAdmin} 
       onClick={() => { if (rol === 'admin') setShowModal(true) }} 
  />             
            )}
        </div>
          <div className="otrso-div">
          </div>
        </div>
        <div className="card">
          <div className="content">
              <div className="task-title">
              <IoIosListBox className="icono" style={{ color: 'white'}} />              
              
              </div>
              <div className="task-input">
              <textarea 
              className="textarea-task" 
              ref={tareaRef} 
              value={tareaEditable} 
              disabled={!isTextareaEnabled} 
              onChange={e => setTareaEditable(e.target.value)}
            ></textarea>            
                          </div>
              <div className="task-buttons">
              {rol === 'admin' && (
              <>
                <div className="button-create-task">
                <button className="tn" onClick={handleButtonClick}>
                  {isTextareaEnabled ? 'Guardar' : 'Editar'}
            </button>               
             </div>
                {tarea !== "No hay tarea seleccionada" && (
          <div className="button-reveal-card">
            <button className="btn" onClick={reveal ? handleResetClick : handleReveal}>
            {reveal ? 'Resetear' : 'Revelar'}
           </button>          </div>
        )}
              </>
            )}
              </div>
          </div>
        </div>
      </div>
      <Modal
        className="my-modal"
        title="Confirmar"
        visible={showModal}
        onOk={handleConfirm}
        onCancel={() => setShowModal(false)}
        cancelText="Cancelar"
        okText="Aceptar"
        okButtonProps={{ className: 'my-modal-confirm-button' }}
        cancelButtonProps={{ className: 'my-modal-cancel-button' }}
      >
        ¿Estás seguro de que deseas guardar la estimación para esta tarea?
</Modal>
    </div>
  );
}

ProbandoSesion.propTypes = {
  setSesionCreada: PropTypes.func.isRequired,
  nombre: PropTypes.string.isRequired,
  rol: PropTypes.string.isRequired,
};

export default ProbandoSesion; 

