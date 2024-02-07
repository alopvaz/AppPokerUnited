//Importar hooks useState y useEffect de React
import { useState, useEffect} from 'react';

//Importar hook useNavigate de React Router
import { useNavigate } from 'react-router-dom';

//Importar componente de icono de cartas de React
import { GiPokerHand } from "react-icons/gi";

import axios from "axios";

import io from 'socket.io-client';

//Importar estilos
import './principal.css';

import PropTypes from 'prop-types';

const socket = io('http://localhost:3000');

function Principal({rol}) {

  const navigate = useNavigate();

  const [nombreSesion, setNombreSesion] = useState('');
  const [sesionCreada, setSesionCreada] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [sesionDisponible, setSesionDisponible] = useState(false);

  useEffect(() => {
    socket.on('sesion-disponible', () => {
      setSesionDisponible(true);
      setSesionCreada(true);
    });

    return () => {
      socket.off('sesion-disponible');
    };
  }, []);

  const crearSesion = () => {
    
    socket.emit('crear-sesion', nombreSesion);
  
    axios.post('http://localhost:3000/crear-sesion', { nombreSesion })
      .then(response => {
        navigate('/probandoSesion', { state: { nombreSesion, sessionId: response.data.sessionId } });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const entrar = () => {
    navigate('/probandoSesion', { state: { nombreSesion } });
  }
    return (
      <div className="borrado-principal">
        <div className="bubbles">
        <span style={{ '--i': 11 }}></span>
          <span style={{ '--i': 12 }}></span>
          <span style={{ '--i': 24 }}></span>s
          <span style={{ '--i': 10 }}></span>
          <span style={{ '--i': 14 }}></span>
          <span style={{ '--i': 23 }}></span>
          <span style={{ '--i': 18 }}></span>
          <span style={{ '--i': 16 }}></span>
          <span style={{ '--i': 19 }}></span>
          <span style={{ '--i': 20 }}></span>
          <span style={{ '--i': 22 }}></span>
          <span style={{ '--i': 25 }}></span>
          <span style={{ '--i': 18 }}></span>
          <span style={{ '--i': 21 }}></span>
          <span style={{ '--i': 15 }}></span>
          <span style={{ '--i': 13 }}></span>
          <span style={{ '--i': 26 }}></span>
          <span style={{ '--i': 17 }}></span>
          <span style={{ '--i': 13 }}></span>
          <span style={{ '--i': 28 }}></span>

          <span style={{ '--i': 11 }}></span>
          <span style={{ '--i': 12 }}></span>
          <span style={{ '--i': 24 }}></span>
          <span style={{ '--i': 10 }}></span>
          <span style={{ '--i': 14 }}></span>
          <span style={{ '--i': 23 }}></span>
          <span style={{ '--i': 18 }}></span>
          <span style={{ '--i': 16 }}></span>
          <span style={{ '--i': 19 }}></span>
          <span style={{ '--i': 20 }}></span>

          <span style={{ '--i': 22 }}></span>
          <span style={{ '--i': 25 }}></span>
          <span style={{ '--i': 18 }}></span>
          <span style={{ '--i': 21 }}></span>
          <span style={{ '--i': 15 }}></span>
          <span style={{ '--i': 13 }}></span>
          <span style={{ '--i': 26 }}></span>
          <span style={{ '--i': 17 }}></span>
          <span style={{ '--i': 13 }}></span>
          <span style={{ '--i': 28 }}></span>       
           </div>
           <div className="center-div">
  <div className="title-div">
    <h1>
      <span className="poker">POKER</span>
      <span className="united">UNITED</span>
    </h1>
  </div>
  <div className="info-div">
  {rol === 'admin' ? (
    <>
      <h2>Nueva Sesión</h2>
      <div className="inputBox-session">
  <input
    type="text"
    value={nombreSesion}
    onChange={(e) => setNombreSesion(e.target.value)}
    required
  />
  <span>Nombre</span>
  <i></i>
</div>
<button  className="botonEntrar" onClick={crearSesion}>Crear</button>

    </>
  ) : (
    <div className='mensajeUsuarioContainer'>
      <GiPokerHand className="androidIcon" />
      <p className='mensajeUsuario'>{sesionCreada ? 'Hay una sesion disponible' : 'No hay sesiones\ndisponibles'}</p>
      <button onClick={entrar} className={sesionCreada ? "botonEntrar" : "botonEntrarOculto"}>Entrar</button>
    </div>
  )}
</div>
</div>
</div>
);
}

Principal.propTypes = {
  rol: PropTypes.string.isRequired,
};

export default Principal;



