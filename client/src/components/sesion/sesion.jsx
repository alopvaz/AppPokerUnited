// Importar las librerías necesarias
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './sesion.css';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

// Conexión con el servidor Socket.IO
const socket = io('http://192.168.20.103:3000');

// Componente Sesion
function Sesion({ rol, nombre, userId }) {

  console.log("El id del usaurio es: " + userId);

  const [estimacion, setEstimacion] = useState('');
const [idSesion, setIdSesion] = useState('');

  // Dentro de la función Sesion
const [showModal, setShowModal] = useState(false);

const handleCloseModal = () => setShowModal(false);

  const location = useLocation();
  const nombreSesion = location.state.nombreSesion;
  const sesionId = location.state.sesionId;
  console.log(sesionId + "hola")

  const handleOpenModal = () => setShowModal(true);

  const [cartaReveladaSeleccionada, setCartaReveladaSeleccionada] = useState(null);
  const [tarea, setTarea] = useState('No hay tarea seleccionada');
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [cartas, setCartas] = useState([{ nombre: nombre, carta: '', userId: userId }]);  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
  const [revelarCartas, setRevelarCartas] = useState(false)

  useEffect(() => {
    

    const handleIniciarTarea = () => {
      setTarea('No hay tarea seleccionada');
      setCartaReveladaSeleccionada(null);
      setCartasSeleccionadas({});
      setRevelarCartas(false);
      setCartaSeleccionada(null); 
    };

// Modifica la función handleNuevaTarea para actualizar el estado con el valor de la estimación y el ID de la sesión
const handleNuevaTarea = (data) => {
  setTarea(data.tarea);
  // Actualiza el estado con el valor de la estimación y el ID de la sesión
  setEstimacion(data.estimacion);
  setIdSesion(data.idSesion);
};

const handleNuevaCarta = (data) => {
  if (!cartas.some((carta) => carta.nombre === data.nombre)) {
    setCartas((cartas) => [...cartas, { nombre: data.nombre, carta: data.carta, userId: data.userId }]);
  }
};
    const handleCartaSeleccionada = (nombre, carta) => {
      setCartasSeleccionadas((prevState) => ({ ...prevState, [nombre]: carta }));
    };

    const handleRevelarCartas = () => {
      setRevelarCartas(true);
    };

    const handleResetVotacion = () => {
      setRevelarCartas(false);
      setCartasSeleccionadas({});
      setCartaReveladaSeleccionada(null);
    };

    const handleCartaAdminSeleccionada = (carta) => {
      console.log('Carta administrador seleccionada:', carta);
      setCartaReveladaSeleccionada(carta);
    };

    socket.on('nueva-tarea', handleNuevaTarea);
    socket.on('nueva-carta', handleNuevaCarta);
    socket.on('carta-seleccionada', handleCartaSeleccionada);
    socket.on('revelar-cartas', handleRevelarCartas);
    socket.on('reset-votacion', handleResetVotacion);
    socket.on('carta-admin-seleccionada', handleCartaAdminSeleccionada);
    socket.on('iniciar-tarea', handleIniciarTarea);



    // Emite la carta inicial del usuario
handleAddCarta(nombre, 'A♠', userId);

    return () => {
      socket.off('nueva-tarea', handleNuevaTarea);
      socket.off('nueva-carta', handleNuevaCarta);
      socket.off('carta-seleccionada', handleCartaSeleccionada);
      socket.off('revelar-cartas', handleRevelarCartas);
      socket.off('reset-votacion', handleResetVotacion);
      socket.off('carta-admin-seleccionada');
      socket.off('iniciar-tarea', handleIniciarTarea);



    };
  }, [cartas, nombre]);

  const handleNuevaTareaClick = () => {
    setMostrarFormulario(true);
  };

  const handleCancelarClick = () => {
    setMostrarFormulario(false);
  };

 // Modifica la función handleAddTarea para incluir el valor de la estimación y el ID de la sesión
const handleAddTarea = () => {
  if (nuevaTarea.trim() === '') {
    alert('El campo de la tarea no puede estar vacío');
    return;
  }

  setTarea(nuevaTarea);
  setNuevaTarea('');
  // Incluye el valor de la estimación y el ID de la sesión en el evento 'nueva-tarea'
  socket.emit('nueva-tarea', { tarea: nuevaTarea, estimacion, idSesion });
  setMostrarFormulario(false);
};

  const handleRevelarCartas = () => {
    if (revelarCartas) {
      setRevelarCartas(false);
      setCartasSeleccionadas({});
      setCartaReveladaSeleccionada(null);
      setCartaSeleccionada(null); // Añade esta línea
      socket.emit('reset-votacion');
    } else {
      setRevelarCartas(true);
      socket.emit('revelar-cartas');
    }
  };
  const handleCartaClick = (carta) => {
    if (rol === 'admin' && revelarCartas) {
      console.log('Carta seleccionada por el administrador:', carta);
      setCartaReveladaSeleccionada(carta);
      socket.emit('carta-admin-seleccionada', carta);
      // Elimina la línea que abre el modal
    } else if (!revelarCartas) {
      setCartaSeleccionada(carta);
      socket.emit('carta-seleccionada', nombre, carta);
    }
  };
  const handleAddCarta = (nombre, carta, userId) => {
    socket.emit('nueva-carta', nombre, carta, userId);
  };

  const handleCrearTarea = () => {
    var nombre = tarea;
    var estimacion = cartaReveladaSeleccionada;
  
    fetch('http://192.168.20.103:3000/crear-tarea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, estimacion, sesionId }),
    })
      .then(response => response.json()) // Cambia esto a response.json()
      .then(data => {
        console.log(data.message);
        let tareaId = data.tareaId;
        
        for (let usuario in cartasSeleccionadas) {
          let votacion = cartasSeleccionadas[usuario];
          let usuarioId = cartas.find(carta => carta.nombre === usuario).userId; // Obtén el ID del usuario
        
          console.log(`Enviando votación: usuarioId=${usuarioId}, tareaId=${tareaId}, votacion=${votacion}`);
        
          fetch('http://192.168.20.103:3000/guardar-votacion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuarioId, tareaId, votacion }), // Utiliza el ID del usuario
          })
          .then(response => response.text())
          .then(data => {
            console.log(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }
  
        setTarea('No hay tarea seleccionada');
        setCartaReveladaSeleccionada(null);
        setCartasSeleccionadas({});
        setRevelarCartas(false);
  
        handleCloseModal();
  
        socket.emit('iniciar-tarea');
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="mi-componente">

    <div>
       <div id='superior' className='navbar'>
        <h1><span className='poker'>POKER</span><span className='united'>UNITED</span></h1>
        <h2 className='text-white'>{nombreSesion}</h2> {/* Muestra el nombre de la sesión aquí */}
        {rol === 'admin' && <button className='text-white'>Finalizar sesión</button>}
      </div>

      <div id="tarea">
        <span className='tarea-texto'>Tarea:  </span>{tarea}
        {rol === 'admin' && (
          <div>
            {!mostrarFormulario ? (
              <div>
                <button className=" 
                btn btn-light font-weight-bold nueva-tarea" onClick={handleNuevaTareaClick}>
                  {tarea === 'No hay tarea seleccionada' ? 'Nueva Tarea' : 'Editar Tarea'}
                </button>
                {tarea !== 'No hay tarea seleccionada' && (
                  <button className="btn btn-light font-weight-bold revelar-cartas" onClick={handleRevelarCartas}>
                    {revelarCartas ? 'RESET VOTACIÓN' : 'REVELAR VOTACIÓN'}
                  </button>
                )}
              </div>
            ) : (
              <div>
                <input style={{ height: '30px', width: '300px' }} type="text" className="form-control" value={nuevaTarea} onChange={e => setNuevaTarea(e.target.value)} required />
                <button className="btn btn-light font-weight-bold" onClick={handleCancelarClick}>Cancelar</button>
                <button className="btn btn-light font-weight-bold" onClick={handleAddTarea}>Crear Tarea</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <Container>
          <Row className="justify-content-start fila mt-3">
          {cartas.map((usuario, index) => (
  <Col xs={2} sm={2} md={1} lg={1} xl={1} key={index} className="mb-5 mt-2 d-flex flex-column align-items-center mr-5">
    <Card
      onClick={rol === 'admin' && revelarCartas ? () => {
        const carta = cartasSeleccionadas[usuario.nombre] || '?';
        setCartaReveladaSeleccionada(carta);
        socket.emit('carta-admin-seleccionada', carta);
      } : null}
      className={`text-center carta-poker reverso-carta ${cartasSeleccionadas[usuario.nombre] ? 'carta-seleccionada' : ''}`}
      style={{ height: '150px', width: '100px' }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = ''}
    >
      <Card.Body>
        {revelarCartas ? (cartasSeleccionadas[usuario.nombre] || '?') : ''}
      </Card.Body>
    </Card>
    <p className="text-black">
  {usuario.nombre}
  {rol === 'admin' &&`(${usuario.userId})`}
</p>  </Col>
))}
          </Row>
        </Container>
      </div>

      {!revelarCartas && tarea !== 'No hay tarea seleccionada' && (
        <div id="cartas-seleccion">
          <Container>
            <Row className="justify-content-md-center fila mt-3 cartas-row">
              {['0', '1', '3', '5', '8', '13', '20', '40', '100', '?', '∞'].map((numero, index) => (
                <Col xs={2} sm={2} md={1} lg={1} xl={1} key={index} className="mb-5 mt-3">
                  <Card
                    className={`text-center carta-poker ${numero === cartaSeleccionada ? 'carta-seleccionada' : ''}`}
                    style={{
                      height: '85px',
                      width: '100%',
                    }}
                    onClick={() => handleCartaClick(numero)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = ''}
                  >
                    <Card.Body>{numero}</Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}
       {cartaReveladaSeleccionada !== null && (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: '80%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <p>Se ha seleccionado</p>
    <Card
  className="text-center carta-poker"
  style={{ height: '150px', width: '100px' }}
  onClick={rol === 'admin' ? handleOpenModal : undefined} // Solo se abre el modal si el rol es 'admin'
>
  <Card.Body>{cartaReveladaSeleccionada}</Card.Body>
</Card>
  </div>
)}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres hacer esto?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => { handleCrearTarea(); }}>            
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>

  );
}

// Validación de las props
Sesion.propTypes = {
  rol: PropTypes.string,
  nombre: PropTypes.string,
};

export default Sesion;
