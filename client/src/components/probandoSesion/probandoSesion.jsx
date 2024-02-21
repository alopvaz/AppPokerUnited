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
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
            <li>
              <div className="card-item">
                <img src={reverso} alt="Imagen 1" />
                <div className="card-name">Juan Carlos</div>
              </div>
            </li>
          </ul>
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