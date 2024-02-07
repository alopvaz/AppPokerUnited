import "./probandoSesion.css";
import { useState, useRef, useEffect } from 'react';
//import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

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

  const [isRevealed, setIsRevealed] = useState(false);

  const [revealedCard, setRevealedCard] = useState(null);
  const [buttonText, setButtonText] = useState('Revelar');
  const [tarea, setTarea] = useState('No hay tarea seleccionada');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef();
  const [usuarios, setUsuarios] = useState([]);

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

  useEffect(() => {
    // Emitir un evento 'unirse-a-sesion' solo cuando el componente se monta
    socket.emit('unirse-a-sesion', nombre);
  }, []); // Dependencia vacía para que se ejecute solo una vez


  useEffect(() => {
    // Emitir el nombre de la sesión al servidor cuando se establece
    if (nombreSesion) {
      socket.emit('crear-sesion', nombreSesion);
    }
  
    socket.on('sesion-disponible', (nombreSesion) => {
      console.log(nombreSesion + " en el useeeffect");
      setNombreSesion(nombreSesion);
    });
  
    // Escucha el evento 'tarea-actualizada' y actualiza la tarea
    socket.on('tarea-actualizada', (tareaActualizada) => {
      console.log("tarea actualizada " + tareaActualizada);
      setTarea(tareaActualizada);
    });
  
    return () => {
      socket.off('sesion-disponible');
      socket.off('tarea-actualizada');
    };
  }, [nombreSesion]); // Dependencia en nombreSesion para que se ejecute cada vez que cambie

  const handleCrearTareaClick = () => {
    setIsEditing(true);
  };

  const handleTareaBlur = () => {
    setIsEditing(false);
    // Emitir el nuevo nombre de la tarea al servidor
    socket.emit('actualizar-tarea', tarea);
  };

  useEffect(() => {
    socket.on('nuevo-usuario', (nombreUsuario) => {
      setUsuarios((usuariosActuales) => [...usuariosActuales, nombreUsuario]);
    });
  
    return () => {
      socket.off('nuevo-usuario');
    };
  }, []); 
  

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
  {usuarios.map((usuario, index) => (
  <li key={index}>
    <img src={isRevealed ? revealedCard : reverso} alt="Carta Reverso" className={`carta-reverso ${isRevealed ? 'is-revealed' : ''}`} />
    <div className="nombreUsuario">{usuario}</div>
  </li>
))}
  </ul>
</div>

      <div className="sesion-cartas">
        <ul>
          {cartas.map((carta) => (
            <li key={carta.value}>
              <button value={carta.value}>
                <img src={carta.image} alt={carta.value.toString()} className="carta" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ProbandoSesion.propTypes = {
  rol: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired
};

export default ProbandoSesion;