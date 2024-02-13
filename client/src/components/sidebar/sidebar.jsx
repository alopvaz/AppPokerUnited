import {
    FaAngleRight,
    FaAngleLeft, 
    FaHome, 
    FaCog,
    FaSignOutAlt,
    FaPlusSquare, // Icono para "Crear Sesion"
    FaHistory, // Icono para "Historial de Sesiones"
} from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { FaRegHandSpock } from 'react-icons/fa';
import logo from './logo.png'; 
import { useState } from 'react'; // Importa useState

const ICON_SIZE = 20;

function Sidebar({visible, show, logout, rol}) { // Añade "rol" como prop

    const [dropdownVisible, setDropdownVisible] = useState(false); // Añade estado para el menú desplegable

    return (
        <>
            <nav className={!visible ? 'navbar' : ''}>
                <button
                    type="button"
                    className="nav-btn"
                    onClick={() => show(!visible)}
                >
                    { !visible
                        ? <FaAngleRight size={30} /> : <FaAngleLeft size={30} />}
                </button>
                <div>
                    <NavLink className="logo" to="/">
                        <img src={logo} alt="logo" />
                    </NavLink>
                    <div className="links nav-top">
                        <NavLink to="/home" className="nav-link" end>
                            <FaHome size={ICON_SIZE} />
                            <span>Home</span>
                        </NavLink>
                        <div className="nav-link" style={{cursor: 'pointer'}} onClick={() => setDropdownVisible(!dropdownVisible)}>
                            <FaRegHandSpock size={ICON_SIZE} />
                            <span>Poker United </span>
                        </div>
                        {dropdownVisible && rol === 'admin' && ( // Si el rol es 'admin', muestra estos elementos
                            <div className="dropdown">
                                <NavLink to="/crearSesion" className="nav-link" style={{marginLeft: '10px', fontSize: '0.8em'}}>
                                    <FaPlusSquare size={ICON_SIZE} />
                                    <span>Crear Sesion</span>
                                </NavLink>
                                <NavLink to="/historial" className="nav-link" style={{marginLeft: '10px', fontSize: '0.8em'}}>
                                    <FaHistory size={ICON_SIZE} />
                                    <span>Historial de Sesiones</span>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
                <div className="links">
                    <NavLink to="/settings" className="nav-link">
                        <FaCog size={ICON_SIZE} />
                        <span>Settings</span> 
                    </NavLink>
                    <NavLink to="/login" className="nav-link" onClick={logout}>
                        <FaSignOutAlt size={ICON_SIZE} />
                        <span>Logout</span> 
                    </NavLink>
                </div>
            </nav>
        </>
    );
}

export default Sidebar;