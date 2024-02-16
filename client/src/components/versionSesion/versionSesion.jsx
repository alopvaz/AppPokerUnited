import './versionSesion.css';
import reverso from "./cartas/reverso.png";
import tapete from "./cartas/tapete.png";
function VersionSesion({ rol, nombre }) {
  return (
    <div className="main-juego">


<div className="juego-cartas" style={{ 
          backgroundImage: `url(${tapete})`, 
          backgroundRepeat: 'no-repeat', 
          backgroundSize: 'cover',
          position: 'relative' // Añade esto para posicionar los elementos hijos
        }}>

<img src={reverso} alt="Carta" style={{ 
          top: 0, 
          left: 0,
          width: '15%', 
          margin: '10px' // Añade esto para agregar un margen
        }}/>
        <img src={reverso} alt="Carta" style={{ 
          top: 0, 
          left: 0,
          width: '15%', 
          margin: '10px' // Añade esto para agregar un margen
        }}/>
        <img src={reverso} alt="Carta" style={{ 
          top: 0, 
          left: 0,
          width: '15%', 
          margin: '10px' // Añade esto para agregar un margen
        }}/>
        <img src={reverso} alt="Carta" style={{ 
          top: 0, 
          left: 0,
          width: '15%', 
          margin: '10px' // Añade esto para agregar un margen
        }}/>
        <img src={reverso} alt="Carta" style={{ 
          top: 0, 
          left: 0,
          width: '15%', 
          margin: '10px' // Añade esto para agregar un margen
        }}/>
        <img src={reverso} alt="Carta" style={{ 
          top: 0, 
          left: 0,
          width: '15%', 
          margin: '10px' // Añade esto para agregar un margen
        }}/>
       
       
      </div>

      <div className="juego-configuracion">

        <div className="configuracion-tareas">
          <div className="tareas-nav">
             {/* Contenido de configuracion-nav */}
             hola
          </div>
          <div className="tareas-tareas">
            <div className="tareas-titulo">
              <h2 class="border">TAREA</h2>
              <h2 class="wave">TAREA</h2>
            </div>
            <div className="tareas-nombre">
            <textarea required></textarea>
            </div>
          </div>
          <div className="tareas-botones">
            <div className="tareas-editar">
              <a href="#" className="btn btn-2">
                EDITAR
            </a>
            </div>
            <div className="tareas-revelar">
              {/* Contenido de boton-revelar */}
              <a href="#" className="btn btn-2">
                REVELAR
              </a>
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
            </a>
          </div>  
        </div>
      </div>
    </div>
  );
}

export default VersionSesion;