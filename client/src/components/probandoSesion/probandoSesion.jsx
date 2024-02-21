import React from 'react';
import './probandoSesion.css';
import reverso from "./cartas/reverso.png";

function ProbandoSesion() {
  return (
    <div className="bodyStyle">
      <div className="container">
        <div className="left-div"> 
          <ul>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            {/* Repite el código anterior para cada carta */}
          </ul>
        </div>
        <div className="card">
          <div className="content">
            <h2>POKER UNITED</h2>
            <div className="task-title">
              <h3>TAREA</h3>
            </div>
            <div className="task-input">
              <textarea></textarea>
            </div>
            <div className="task-buttons">
              <a href="#" className="btn">Crear</a>
              <a href="#" className="btn">Revelar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProbandoSesion;