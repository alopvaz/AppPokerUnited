import React, { useEffect } from 'react';
import './probandoSesion.css';
import reverso from "./cartas/reverso.png";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';import io from 'socket.io-client';

const socket = io('http://localhost:3000');


function ProbandoSesion({ setSesionCreada, nombre, rol }) {

  const navigate = useNavigate();

  //Usuaris conectados
  const [usuarios, setUsuarios] = useState([]);

  //Cuando el admin hace click sobre Salir setSesionCreada a false
  const handleFinalizarClickAdmin = () => {
    // Emitir un evento al servidor para hacer que setSesionCreada sea falso
    socket.emit('cerrarSesion');
    // Redirigir al admin a la página de crearSesion
    navigate("/crearSesion");
    // Cambiar el estado de setSesionCreada a false
    setSesionCreada(false);
  };

  useEffect(() => {
    //Cuando el admin hace click sobre Salir setSesionCreada a false
    socket.on('cerrarSesion', () => {
      setSesionCreada(false);
    });

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      socket.off('usuarioSalio');
    };
  }, []);

  useEffect(() => {
    socket.emit('usuarioConectado', { nombre, rol });
  }, []);
  
  // Escuchar el evento 'actualizarUsuarios' del servidor para actualizar la lista de usuarios
  useEffect(() => {
    socket.on('actualizarUsuarios', (usuarios) => {
      setUsuarios(usuarios);
    });
  
    return () => {
      socket.off('actualizarUsuarios');
    };
  }, []);
  
  return (
    <div className="bodyStyle">
    {rol === 'admin' && <button className="exit-button" onClick={handleFinalizarClickAdmin}>Finalizar</button>}
 <div className="container">
        <div className="left-div"> 
        <div className="div-lista">
        <ul>
              <li>
                <div className="card-item">
                  <img src={reverso} alt="Imagen 1" />
                  <div className="card-name">{nombre}</div>
                </div>
              </li>
            </ul>
        </div>
          <div className="otrso-div">
          </div>
        </div>
        <div className="card">
          <div className="content">
              <div className="task-title">
                <h3>TAREA</h3>
              </div>
              <div className="task-input">
                <textarea></textarea>
              </div>
              <div className="task-buttons">
                <div className="button-create-task">
                  <button className="btn">Crear</button>
                  </div>
                <div className="button-reveal-card">
                    <button className="btn">Revelar</button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProbandoSesion;