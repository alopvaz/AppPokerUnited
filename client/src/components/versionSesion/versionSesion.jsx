import './versionSesion.css';
import reverso from "./cartas/reverso.png";
function VersionSesion({ rol, nombre }) {
  return (
    <div className="main-juego">

      <div className="juego-cartas">
        {/* Contenido de sesion-juego */}
      </div>

      <div className="juego-configuracion">

        <div className="configuracion-tareas">
          <div className="tareas-nav">
             {/* Contenido de configuracion-nav */}
             hola
          </div>
          <div className="tareas-tareas">
            <div className="tareas-titulo">
              {/* Contenido de tareas-titulo */}
              titulo
            </div>
            <div className="tareas-nombre">
              {/* Contenido de tareas-nombre */}
              nombre
            </div>
          </div>
          <div className="tareas-botones">
            <div className="tareas-editar">
              {/* Contenido de boton-editar */}
              editar
            </div>
            <div className="tareas-revelar">
              {/* Contenido de boton-revelar */}
              eliminar
            </div>
          </div>
        </div>
        <div className="configuracion-estimacion">
          <div className="estimacion-nombre">
            <h2 class="border">ESTIMACION</h2>
            <h2 class="wave">ESTIMACION</h2>
          </div>
          <div className="estimacion-carta">
            <img src={reverso} alt="Carta" className="carta-img" />         
          </div>
          <div className="estimacion-revelar">
            <a href="#" className="btn btn-2">
            REVELAR
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