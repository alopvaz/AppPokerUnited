/* eslint-disable no-unused-vars */
import "./probandoSesion.css";
import "./sesionCartas.css";
import "./sesionJuego.css";

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Importacion de imagenes de cartas
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
import reverso from "./cartas/reverso.png";

const cartas = [
  { image: cero, value: 0 },
  { image: uno, value: 1 },
  { image: dos, value: 2 },
  { image: tres, value: 3 },
  { image: cinco, value: 5 },
  { image: ocho, value: 8 },
  { image: trece, value: 13 },
  { image: veintiuno, value: 21 },
  { image: treintaycuatro, value: 34 },
  { image: cincuentaycinco, value: 55 },
  { image: ochentaynueve, value: 89 },
  { image: infinito, value: 'infinito' },
  { image: interrogacion, value: '?' },
];

function ProbandoSesion({ rol, nombre }) {
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedCard, setRevealedCard] = useState(null);
  const [buttonText, setButtonText] = useState('Revelar');
  const [tarea, setTarea] = useState('No hay tarea seleccionada');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef();
  const [usuarios, setUsuarios] = useState([]);
  const usuariosOrdenados = usuarios.sort((a, b) => a.nombre === nombre ? -1 : b.nombre === nombre ? 1 : 0);

  const location = useLocation();
  const [nombreSesion, setNombreSesion] = useState(location.state ? location.state.nombreSesion : '');

  const navigate = useNavigate();

  const handleSalirClick = () => {
    navigate('/poker'); // Cambia esto por la ruta a la que quieres navegar
  };

  const handleButtonClick = () => {
    if (isRevealed) {
      // If the card is already revealed, reset it
      setIsRevealed(false);
      setRevealedCard(null);
      setButtonText('Revelar');
    } else {
      // If the card is not revealed, reveal it
      setIsRevealed(true);
      setRevealedCard(cinco); // Aquí puedes poner la carta que quieras revelar
      setButtonText('Resetear');
    }
  };  

  const handleCrearTareaClick = () => {
    setIsEditing(true);
  };

  const handleTareaBlur = () => {
    setIsEditing(false);
    // Emitir el nuevo nombre de la tarea al servidor
    socket.emit('actualizar-tarea', tarea);
  };

  useEffect(() => {


    // Emitir un evento 'unirse-a-sesion' solo cuando el componente se monta
    socket.emit('unirse-a-sesion', nombre);
  
    // Emitir el nombre de la sesión al servidor cuando se establece
    if (nombreSesion) {
      socket.emit('crear-sesion', nombreSesion);
    }
  
    socket.on('usuarios-actuales', (usuariosActuales) => {
      console.log('Usuarios actuales:', usuariosActuales); // Imprimir por consola los usuarios actuales
      setUsuarios(usuariosActuales);
    });
  
    // Escuchar el evento 'nuevo-usuario' y agregarlo a la lista de usuarios
  
    // Escuchar el evento 'usuario-desconectado' y eliminarlo de la lista de usuarios
    socket.on('usuario-desconectado', (nombreUsuario) => {
      setUsuarios((usuariosActuales) => usuariosActuales.filter(usuario => usuario.nombre !== nombreUsuario));
    });
  
    socket.on('sesion-disponible', (nombreSesion) => {
      console.log("El nombre de la sesion es: " + nombreSesion);
      setNombreSesion(nombreSesion);
    });
  
    // Escucha el evento 'tarea-actualizada' y actualiza la tarea
    socket.on('tarea-actualizada', (tareaActualizada) => {
      console.log("El nombre de la tarea es " + tareaActualizada);
      setTarea(tareaActualizada);
    });

    
    socket.on('usuario-votado', (usuario) => {
      setUsuarios((usuariosActuales) => usuariosActuales.map(usuarioActual => 
        usuarioActual.nombre === usuario.nombre 
          ? { ...usuario, hasVoted: true, isRevealed: true } // Asegúrate de que hasVoted y isRevealed se actualizan
          : usuarioActual
      ));
    });

    return () => {
      socket.off('usuario-votado');
      socket.off('usuarios-actuales');
      socket.off('usuario-desconectado');
      socket.off('sesion-disponible');
      socket.off('tarea-actualizada');
    };
  }, [nombre, nombreSesion]);

  const handleCardClick = (carta) => {
    setSelectedCard(carta.value);
    setRevealedCard(carta.image);
    setUsuarios(prevUsuarios => {
        const updatedUsuarios = prevUsuarios.map(usuario => 
            usuario.nombre === nombre 
                ? { ...usuario, revealedCard: carta.image, isRevealed: true, hasVoted: true }
                : usuario
        );

        // Imprime aquí para ver el estado actualizado de los usuarios en este cliente
        console.log("Usuarios después de votar:", updatedUsuarios);

        return updatedUsuarios;
    });

    // Emitir un evento al servidor indicando que el usuario ha votado
    console.log("El nombre del usuario es: " + nombre + " y la carta votada es: " + carta.image);
    socket.emit('usuario-votado', { nombre: nombre, revealedCard: carta.image, hasVoted: true }); 
};

  
  return (
    <div className="main-sesion">
      <div className="sesion-nav">
        <div className="poker-united">
          <h2 className="border letter">POKERUNITED</h2>
          <h2 className="wave letter">
            <span className="poker">POKER</span>
            <span className="united">UNITED</span>
          </h2>
        </div>
        <h2 className="nombreSesion">{nombreSesion}</h2> {/* Aquí se muestra el nombre de la sesión */}
        <button className="button-salir" onClick={handleSalirClick}>Salir</button>
      </div>

      <div className="sesion-tareas">
        <span></span>
        <div id="sesion-tarea">
          <div style={{
            fontSize: '17px', marginTop: '20px', color: "#5898b7", fontWeight: 'bold'
          }}>Tarea:
            <input
              ref={inputRef}
              style={{
                height: '30px',
                width: '300px',
                fontSize: '16px',
                fontStyle: tarea === 'No hay tarea seleccionada' ? 'italic' : 'normal'
              }}
              type="text"
              className={`form-control ${isEditing ? 'editing' : ''}`}
              value={tarea}
              onChange={e => setTarea(e.target.value)}
              onBlur={handleTareaBlur} // Usar handleTareaBlur en lugar de setIsEditing(false)
              required
              disabled={!isEditing}
            />
          </div>
          {rol === 'admin' && (
            <div className="botones-centrados">
              <button onClick={handleCrearTareaClick} className="btn btn-2">
                {tarea === 'No hay tarea seleccionada' ? 'Crear Tarea' : 'Editar Tarea'}
                <span></span>
                <span></span>
              </button>
              <button className="btn btn-2" onClick={handleButtonClick}>
                {buttonText}
                <span></span>
                <span></span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="sesion-juego">
        <ul>
        {usuariosOrdenados.map((usuario, index) => (
  <li key={index}>
    <img 
      src={usuario.nombre === nombre && usuario.isRevealed ? usuario.revealedCard : reverso}
      alt="Carta Reverso" 
      className={`carta-reverso ${usuario.isRevealed ? 'is-revealed' : ''} ${usuario.hasVoted ? 'has-voted' : ''}`}
      style={{
        boxShadow: usuario.hasVoted ? `0 0 5px 2px #5898b7` : 'none', // Sombra azul si ha votado
        border: usuario.hasVoted ? '2px solid #5898b7' : 'none', // Borde azul si ha votado
      }}
    />        
    <div className="nombreUsuario">{usuario.nombre}</div>
  </li>
))}


        </ul>
  </div>

      <div className="sesion-cartas">
        {tarea !== 'No hay tarea seleccionada' && (
          <ul>
            {cartas.map((carta) => (
              <li key={carta.value}>
                <button value={carta.value} className={`carta-btn ${carta.value === selectedCard ? 'selected' : ''}`} onClick={() => handleCardClick(carta)}>
                  <img src={carta.image} alt={carta.value.toString()} className="carta" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

ProbandoSesion.propTypes = {
  rol: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired
};

export default ProbandoSesion;
