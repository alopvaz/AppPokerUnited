import './versionSesion.css';
import reverso from "./cartas/reverso.png";

function VersionSesion({ rol, nombre }) {

  return (
    <div className="main-juego">
   
      <div className="juego-cartas">
        {/* Contenido de sesion-juego */}
        <h1>hola</h1>
      </div>
      <div className="juego-configuracion">
        <div className="configuracion-tareas">

          <div className="tareas-nombreSesion">
            <p>NombreSesion</p>
          </div>

          <div className="tareas-nombreTarea">

            <div className="nombreTareaFijo">
              {/* Contenido de nombreTareaFijo */}
              <p>Tarea: </p>
            </div>

            <div className="nombreTareaMovil">
              {/* Contenido de nombreTareaMovil */}
              <h4>Nombre de la tarea</h4>
            </div>
          </div>
          <div className="tareas-botones">
            <div className="boton-editar">
              {/* Contenido de boton-editar */}
              <a href="#" class="btn btn-2">EDITAR
              <span></span>
            <span></span></a>


            </div>
            <div className="boton-revelar">
              {/* Contenido de boton-revelar */}
              <a href="#" class="btn btn-2">REVELAR
              <span></span>
            <span></span>
            </a>

            </div>
          </div>
        </div>
        <div className="configuracion-estimacion">
  <div className="nombreEstimacionFijo">
    <p className='esti'>Estimación:</p>
  </div>
  <div className="estimacion-carta">
    <img src={reverso} alt="Carta" className="carta-img" />         
  </div>
  <div className="estimacion-revelar">
    <a href="#" class="btn btn-2">REVELAR
      <span></span>
      <span></span>
    </a>
  </div>
</div>
</div>
    </div>
  );
}

export default VersionSesion;