import { useState, useEffect } from 'react';
import Login from "./components/login/login";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./style/index.css";
import Principal from './components/principal/principal';
import Sesion from './components/sesion/sesion';
import useLocalStorage from './localStorage/useLocalStorage';
import sessionStorage from './localStorage/sessionStorage';
import Sidebar from './components/sidebar/sidebar';
import ProbandoSesion from './components/probandoSesion/probandoSesion';
import Historial from './components/historial/historial';
import VersionSesion from './components/versionSesion/versionSesion';

function App() {
  const [navVisible, setNavVisible] = useLocalStorage(true);
  const [userState, setUserState] = sessionStorage('userState', {
    isAuthenticated: false,
    rol: '',
    nombre: '',
    userId: ''
  });
  const [sesionCreada, setSesionCreada] = useLocalStorage('sesionCreada', false);

  const showNavbar = (show) => {
    setNavVisible(show);
  };

  const authenticate = (rol, nombre, id) => {
    setUserState({
      isAuthenticated: true,
      rol: rol,
      nombre: nombre,
      userId: id
    });
    showNavbar(true); 
  };

  const logout = () => {
    setUserState({
      isAuthenticated: false,
      rol: '',
      nombre: '',
      userId: ''
    });
    showNavbar(false); 
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={userState.isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />          
          <Route path="/login" element={<Login authenticate={authenticate} isAuthenticated={userState.isAuthenticated} />} />





          <Route path='/home' element={
            <div className={!navVisible ? "page" : "page page-with-navbar"}>
            <h1 style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
              }}>Home</h1>            
            </div>
          } />
          <Route path='/analytics' element={
            <div className={!navVisible ? "page" : "page page-with-navbar"}>
              <h1>Analystics</h1>
            </div>
          }/>
          <Route path='/orders' element={
            <div className={!navVisible ? "page" : "page page-with-navbar"}>
              <h1>Orders</h1>
            </div>
          }/> 
          <Route path="/sesion" element={
    <div className={!navVisible ? "page" : "page page-with-navbar"}>
      <Sesion rol={userState.rol} nombre={userState.nombre} userId={userState.userId} />
    </div>
  }/>
 <Route path='/probandoSesion' element={
  <div className={!navVisible ? "page" : "page page-with-navbar"}>
    {userState.rol && userState.nombre ? <ProbandoSesion id={userState.userId} rol={userState.rol} nombre={userState.nombre} setSesionCreada={setSesionCreada} showNavbar={showNavbar} navVisible={navVisible}/> : null}
  </div>
}/>
<Route path='/historial' element={
  <div className={!navVisible ? "page" : "page page-with-navbar"}>
    <Historial />
  </div>
}/>

<Route path="/crearSesion" element={
    <div className={!navVisible ? "page" : "page page-with-navbar"}>
        <Principal rol={userState.rol} sesionCreada={sesionCreada} setSesionCreada={setSesionCreada} showNavbar={showNavbar} />
    </div>
}/>
<Route path="/settings" element={ // Añade una nueva ruta para "/settings"
  <div className={!navVisible ? "page" : "page page-with-navbar"}>
    {userState.rol && userState.nombre ? <VersionSesion rol={userState.rol} nombre = {userState.nombre}/> : null}
      
  </div>
}/>












          {/* ...resto de las rutas... */}
        </Routes>
        <RenderSidebar userState={userState} showNavbar={showNavbar} logout={logout} navVisible={navVisible} />
      </div>
    </BrowserRouter>
  );
}

function RenderSidebar({ userState, showNavbar, logout, navVisible }) {
  const location = useLocation();

  if (location.pathname === '/probandoSesion' || !userState.isAuthenticated) {
    return null;
  }

  return (
    <Sidebar
      visible={navVisible}
      show={showNavbar}
      logout={logout}
      rol={userState.rol}
    />
  );
}

export default App;