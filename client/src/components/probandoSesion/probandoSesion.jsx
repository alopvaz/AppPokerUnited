//Importaciones
import { useEffect, useState } from 'react';
import './probandoSesion.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import useLocalStorage from '../../Storage/useLocalStorage';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoIosExit,IoIosListBox } from "react-icons/io";
import React from 'react';

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

//Constante que contiene la dirección del servidor
const socket = io('http://192.168.20.103:3000');

function ProbandoSesion({ setSesionCreada, nombre, rol, id, showNavbar, navVisible }) {

  const location = useLocation();
  const navigate = useNavigate();
  const tareaRef = React.useRef();

  const [usuarios, setUsuarios] = useLocalStorage('usuarios', []);
  const [tarea, setTarea] = useLocalStorage('tarea', "No hay tarea seleccionada");
  const [isTextareaEnabled, setTextareaEnabled] = React.useState(false);
  const [tareaEditable, setTareaEditable] = useState(tarea);
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useLocalStorage('showModal', false);
  const [reveal, setReveal] = useLocalStorage('reveal', false);  
  const [cartaSeleccionadaAdmin, setCartaSeleccionadaAdmin] = useLocalStorage('cartaSeleccionadaAdmin', null);
   
  let sessionId;
  if (location && location.state) {
    sessionId = location.state.sessionId;
    console.log("SessionId:", sessionId);
  }

  const crearTarea = () => {
    axios.post('http://192.168.20.103:3000/crear-tarea', { 
      nombreTarea: tarea, 
      estimacion: cartaSeleccionadaAdmin, 
      sessionId: sessionId 
    })
    .then(response => {
      console.log(response.data);
      const taskId = response.data.taskId;
      crearVotaciones(taskId);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  const crearVotaciones = (taskId) => {
    usuarios.forEach(usuario => {
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
    crearTarea();
    handleResetClick();
    setTarea("No hay tarea seleccionada");
    socket.emit('tareaActualizada', "No hay tarea seleccionada"); 
    setShowModal(false);
  }

  const handleAdminCardClick  = (usuario) => {
    if (rol === 'admin' && (reveal || (usuario.nombre === nombre && usuario.rol === 'admin'))) {
      if (usuario.cardSelected !== undefined) {
        setCartaSeleccionadaAdmin(usuario.cardSelected);
        socket.emit('cartaSeleccionadaAdmin', usuario.cardSelected);
      }
    }
  };

  const handleReveal = () => {
    setReveal(true);
    socket.emit('revelarCartas');
  };

  const handleResetClick = () => {
    let usuariosActualizados = usuarios.map(usuario => {
      return { ...usuario, isSelected: false, cardSelected: null };
    });
    socket.emit('usuariosActualizados', usuariosActualizados);
    setUsuarios(usuariosActualizados);  
    setReveal(false);
    setCartaSeleccionadaAdmin(null);
    socket.emit('cartaSeleccionadaAdminCambiada', null);
    setCartaSeleccionada(null);
    socket.emit('reset');
  }; 

  const handleFinalizarClickAdmin = () => {
    setUsuarios([]);
    socket.emit('cerrarSesion');
    navigate("/crearSesion");
    setSesionCreada(false);
    setTarea("No hay tarea seleccionada");
  };

  const handleSalirClick = () => {
    let usuariosActuales = [...usuarios];
    let indiceUsuario = usuariosActuales.findIndex(usuario => usuario.id === id);  
    if (indiceUsuario !== -1) {
      usuariosActuales.splice(indiceUsuario, 1);
    }
    setUsuarios(usuariosActuales);
    socket.emit('usuarioSalio', {id, nombre, rol });
    navigate("/crearSesion");
  };

  const handleGuardarClick = () => {
    socket.emit('tareaActualizada', tareaEditable);
    setTarea(tareaEditable);
    setTareaEditable(tareaEditable);
    setTextareaEnabled(false);
  };

  const handleEditarClick = () => {
    setTextareaEnabled(true);
    if (tarea === "No hay tarea seleccionada") {
      setTarea("");
      setTareaEditable(""); 
    }
    setTimeout(() => {
      tareaRef.current.focus();
    }, 0);
  };

  const handleCardClick = (e) => {
    const cardValue = e.target.getAttribute('data-value');
    const cards = document.querySelectorAll('.carta-pequena');
    cards.forEach(card => card.classList.remove('raised'));
    e.target.classList.add('raised');
    let usuariosActuales = [...usuarios];
    let usuarioActualIndex = usuariosActuales.findIndex(usuario => usuario.nombre === nombre && usuario.rol === rol && usuario.id === id);
    if (usuarioActualIndex !== -1) {
      let usuarioActual = { ...usuariosActuales[usuarioActualIndex] };
      usuarioActual.isSelected = true;
      usuarioActual.cardSelected = cardValue;
      usuariosActuales[usuarioActualIndex] = usuarioActual;
      setCartaSeleccionada(cardValue);
    }
    setUsuarios(usuariosActuales);
    socket.emit('usuariosActualizados', usuariosActuales);
  };

  let index = usuarios.findIndex(usuario => usuario.nombre === nombre && usuario.rol === rol);
  if (index !== -1) {
    let usuarioActual = {
      id: id,
      nombre: nombre,
      rol: rol,
      isSelected: usuarios[index].isSelected || false,
      cardSelected: usuarios[index].cardSelected || null
    }; 
    usuarios.splice(index, 1);
    usuarios.unshift(usuarioActual);
  }

  const handleButtonClick = () => {
    if (isTextareaEnabled) {
      handleGuardarClick();
    } else {
      handleEditarClick();
    }
  };
  
  useEffect(() => {
    socket.on('cartaSeleccionadaAdminCambiada', (carta) => {
      setCartaSeleccionadaAdmin(carta);
    });
      return () => {
      socket.off('cartaSeleccionadaAdminCambiada');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    socket.on('reset', () => {
      setReveal(false);
      setCartaSeleccionada(null);
    });
    socket.on('usuariosActualizados', (usuariosActualizados) => {
      setUsuarios(usuariosActualizados);
    });
      return () => {
      socket.off('reset');
      socket.off('usuariosActualizados');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
 
  useEffect(() => {
    socket.on('cerrarSesion', () => {
      setUsuarios([]);
      setSesionCreada(false);
      navigate("/crearSesion");
    });
    return () => {
      socket.off('cerrarSesion');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    socket.on('actualizarUsuarios', (usuariosActualizados) => {
      setUsuarios(usuariosActualizados);
      let usuarioActualizado = usuariosActualizados.find(usuario => usuario.id === id);
      if (usuarioActualizado) {
        setCartaSeleccionada(usuarioActualizado.cardSelected);
      }
  });
    return () => {
      socket.off('actualizarUsuarios');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); 
  
  useEffect(() => {
    socket.emit('usuarioConectado', {id, nombre, rol, isSelected: false, cardSelected: null });
    console.log('usuarioConectado', id, nombre, rol);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('actualizarTarea', (tarea) => {
      setTarea(tarea);
      setTareaEditable(tarea);
    });
    return () => {
      socket.off('actualizarTarea');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    showNavbar(navVisible);
  }, [navVisible, showNavbar]);

  useEffect(() => {
    socket.on('cartaSeleccionadaAdmin', (carta) => {
      console.log(`Cliente recibió carta: ${carta}`);
      setCartaSeleccionadaAdmin(carta);
    });
    return () => {
      socket.off('cartaSeleccionadaAdmin');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('actualizarTarea', (tareaActualizada) => {
      setTarea(tareaActualizada);
      setTareaEditable(tareaActualizada);
    });
    return () => {
      socket.off('actualizarTarea');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
    
  useEffect(() => {
    socket.on('revelarCartas', () => {
      setReveal(true);
    });

    return () => {
      socket.off('revelarCartas');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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
      </button>
      }
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
                >
              </textarea>            
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
                    </button>          
                  </div>
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

