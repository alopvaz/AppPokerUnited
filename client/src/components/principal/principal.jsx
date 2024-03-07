//Importaciones
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { GiPokerHand } from "react-icons/gi";
import axios from "axios";
import io from 'socket.io-client';
import './principal.css';
import PropTypes from 'prop-types';
import useLocalStorage from '../../Storage/useLocalStorage';

//Constante que contiene la dirección del servidor
const socket = io('http://192.168.20.103:3000');

function Principal({rol, sesionCreada, setSesionCreada, showNavbar}) {

    //Constante que almacena la función que redirige a la página de la sesión
  const navigate = useNavigate();
    //Constantes que almacenan el nombre de la sesión y la función que lo modifica
  const [nombreSesion, setNombreSesion] = useLocalStorage('nombreSesion', '');

  //Función que crea una sesión
  const crearSesion = () => {
    socket.emit('crear-sesion');
    socket.emit('crear-sesion', nombreSesion);  
    axios.post('http://192.168.20.103:3000/crear-sesion', { nombreSesion })
      .then(response => {
        navigate('/probandoSesion', { state: { nombreSesion, sessionId: response.data.sessionId } });
        setSesionCreada(true);
        showNavbar(false);
        socket.emit('sesion-creada'); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  //Función que redirige a la página de la sesión
  const entrar = () => {
    navigate('/probandoSesion', { state: { nombreSesion } });
    showNavbar(false); 
  }

  useEffect(() => {
    // Handle 'sesion-disponible' event
    socket.on('sesion-disponible', () => {
      setSesionCreada(true);
    });
  
    // Handle 'cerrarSesion' event
    socket.on('cerrarSesion', () => {
      setSesionCreada(false);
    });
  
    // Handle 'estado-sesion' event
    socket.on('estado-sesion', (sesionActiva) => {
      setSesionCreada(sesionActiva);
    });
  
    // Emit 'solicitar-estado-sesion' event and handle 'estado-sesion' event
    socket.emit('solicitar-estado-sesion');
    socket.on('estado-sesion', (sesionActiva) => {
      setSesionCreada(sesionActiva);
    });
  
    // Handle 'sesion-creada' event
    socket.on('sesion-creada', (sessionName) => {
      setNombreSesion(sessionName);
      setSesionCreada(true);
    });
  
    // Clean up function to remove all event listeners
    return () => {
      socket.off('sesion-disponible');
      socket.off('cerrarSesion');
      socket.off('estado-sesion');
      socket.off('sesion-creada');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="borrado-principal">
      <div className="bubbles">
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
              <button className="botonEntrar" onClick={crearSesion}>Crear</button>
            </>
          ) : (
              <div className='mensajeUsuarioContainer'>
                <GiPokerHand className="androidIcon" />
                <p className='mensajeUsuario'>  {sesionCreada ? `La sesión ${nombreSesion} está disponible` : 'No hay sesiones\ndisponibles'}</p>
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
  sesionCreada: PropTypes.bool.isRequired,
  setSesionCreada: PropTypes.func.isRequired,
};

export default Principal;



