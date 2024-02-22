import React, { useEffect } from 'react';
import './probandoSesion.css';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import io from 'socket.io-client';
import useLocalStorage from '../../localStorage/useLocalStorage';
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


const socket = io('http://localhost:3000');

function ProbandoSesion({ setSesionCreada, nombre, rol }) {

  const navigate = useNavigate();

  //Estado que maneja la lista de usuarios conectados
  const [usuarios, setUsuarios] = useLocalStorage('usuarios', []);
 
  //Cuando el admin hace click sobre Salir setSesionCreada a false
  const handleFinalizarClickAdmin = () => {
    // Emitir un evento al servidor para hacer que setSesionCreada sea falso
    setUsuarios([]);
    socket.emit('cerrarSesion');
    // Redirigir al admin a la página de crearSesion
    navigate("/crearSesion");
    // Cambiar el estado de setSesionCreada a false
    setSesionCreada(false);
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
  }, []);

  useEffect(() => {
    let longitudAnterior = 0;
  
    // Luego escuchar el evento 'actualizarUsuarios'
    socket.on('actualizarUsuarios', (usuariosActualizados) => {
      // Actualizar el estado de 'usuarios' con la lista de usuarios recibida
      setUsuarios(usuariosActualizados);
  
      // Si la longitud de 'usuarios' aumenta, mostrar un mensaje
      if (usuariosActualizados.length > longitudAnterior) {
        console.log('Un nuevo usuario se ha conectado' + usuariosActualizados[usuariosActualizados.length - 1].nombre);
      }
  
      longitudAnterior = usuariosActualizados.length;
    });
  
    // Limpiar el listener cuando el componente se desmonta
    return () => {
      socket.off('actualizarUsuarios');
    };
  }, []); // Eliminado 'usuarios' de las dependencias

  useEffect(() => {
    socket.emit('usuarioConectado', { nombre, rol });
    console.log('usuarioConectado', nombre, rol);
  }, []);

  const handleSalirClick = () => {
    // Obtener la lista actual de usuarios del localStorage
    let usuariosActuales = [...usuarios];
    // Encontrar el índice del usuario en la lista
    let indiceUsuario = usuariosActuales.findIndex(usuario => usuario.nombre === nombre && usuario.rol === rol);
    // Si el usuario se encuentra en la lista, eliminarlo
    if (indiceUsuario !== -1) {
      usuariosActuales.splice(indiceUsuario, 1);
    }
    // Actualizar la lista de usuarios en el localStorage
    setUsuarios(usuariosActuales);
    // Emitir un evento al servidor para indicar que el usuario ha salido de la sesión
    socket.emit('usuarioSalio', { nombre, rol });
    // Redirigir al usuario a la página de inicio
    navigate("/crearSesion");
  };

    // Suponiendo que 'usuarioActual' es el usuario actual
    let usuarioActual = {nombre: nombre, rol: rol}; // reemplaza esto con el usuario actual
    // Encuentra el usuario actual en el array y lo elimina
    let index = usuarios.findIndex(usuario => usuario.nombre === usuarioActual.nombre && usuario.rol === usuarioActual.rol);
    if (index !== -1) {
      usuarios.splice(index, 1);
    }
    usuarios.unshift(usuarioActual);

    const [tarea, setTarea] = React.useState("No hay tarea seleccionada");
    const [isTextareaEnabled, setTextareaEnabled] = React.useState(false);
    const tareaRef = React.useRef();


    const handleEditarClick = () => {
      // Habilitar el textarea cuando se hace click en "Editar"
      setTextareaEnabled(true);
    
      // If the current task is "No hay tarea seleccionada", clear it
      if (tarea === "No hay tarea seleccionada") {
        setTarea("");
      }
    
      // Focus the textarea
      tareaRef.current.focus();
    };
    
  return (
    <div className="bodyStyle">
    {rol === 'admin' && <button className="exit-button" onClick={handleFinalizarClickAdmin}>Finalizar</button>}
    {rol !== 'admin' && <button className="exit-button" onClick={handleSalirClick}>Salir</button>}
 <div className="container">
        <div className="left-div"> 
        <div className="div-lista">
        <ul>
      {usuarios.map((usuario, index) => (
        <li key={index}>
          <div className="card-item">
            <img src={reverso} alt="Imagen 1" />
            <div className="card-name">{usuario.nombre}</div>
          </div>
        </li>
      ))}
    </ul>
        </div>
        <div className="div-restante">
  {cartas.map((carta, index) => (
    <img className='carta-pequena' key={index} src={carta.img} alt={`Carta ${carta.value}`} data-value={carta.value} />
  ))}
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
                <textarea ref={tareaRef} value={tarea} disabled={!isTextareaEnabled} onChange={e => setTarea(e.target.value)}></textarea>              
                </div>
              <div className="task-buttons">
              {rol === 'admin' && (
              <>
                <div className="button-create-task">
                  <button className="tn" onClick={handleEditarClick}>Editar</button>
                </div>
                <div className="button-reveal-card">
                  <button className="btn">Revelar</button>
                </div>
              </>
            )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProbandoSesion;