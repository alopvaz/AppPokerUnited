import React from 'react';
import {
    FaAngleRight,
    FaAngleLeft, 
    FaHome, // Importa FaHome aquí
    FaShoppingCart, 
    FaCog,
    FaSignOutAlt,
    FaBars
} from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { FaRegHandSpock } from 'react-icons/fa';
import logo from './logo.png'; // Importa tu logo aquí

const ICON_SIZE = 20;
function Sidebar({visible, show, logout}) {

    return (
        <>
            {/* Comenta o elimina este bloque de código si no quieres el botón de hamburguesa
            <div className="mobile-nav">
                <button
                    className="mobile-nav-btn"
                    onClick={() => show(!visible)}
                >
                    <FaBars size={24}  />
                </button>
            </div>
            */}
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
                        <img src={logo} alt="logo" /> {/* Usa tu logo aquí */}
                    </NavLink>
                    <div className="links nav-top">
                        <NavLink to="/home" className="nav-link" end>
                            <FaHome size={ICON_SIZE} /> {/* Usa FaHome aquí */}
                            <span>Home</span>
                        </NavLink>
                        <NavLink to="/poker" className="nav-link">
                            <FaRegHandSpock size={ICON_SIZE} />
                            <span>Poker United </span>
                        </NavLink>
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