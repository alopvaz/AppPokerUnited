import  { useState, useEffect } from 'react';
import Login from "./components/login/login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style/index.css";
import Principal from './components/principal/principal';
import Sesion from './components/sesion/sesion';
import useLocalStorage from './localStorage/useLocalStorage';
import Sidebar from './components/sidebar/sidebar';
import ProbandoSesion from './components/probandoSesion/probandoSesion';
function App() {

  const [navVisible, showNavbar] = useState(false);
  
  const [userState, setUserState] = useLocalStorage('userState', {
    isAuthenticated: false,
    rol: '',
    nombre: '',
    userId: ''
  });

  const authenticate = (rol, nombre, id) => {
    setUserState({
      isAuthenticated: true,
      rol: rol,
      nombre: nombre,
      userId: id
    });
    showNavbar(true); // Mostrar el Navbar después de iniciar sesión
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const logout = () => {
    setUserState({
      isAuthenticated: false,
      rol: '',
      nombre: '',
      userId: ''
    });
    showNavbar(false); // Ocultar el Navbar después de cerrar sesión
  };
  return (
    <BrowserRouter>
      <div className="App">
        {userState.isAuthenticated && <Sidebar visible={navVisible} show={showNavbar} logout={logout} />}
        <Routes>
        <Route path="/" element={userState.isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />          
        <Route path="/login" element={<Login authenticate={authenticate} isAuthenticated={userState.isAuthenticated} />} />
          <Route path='/home' element={
            <div className={!navVisible ? "page" : "page page-with-navbar"}>
              <h1>Home</h1>
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
          <Route path='/poker' element={
            <div className={!navVisible ? "page" : "page page-with-navbar"}>
              <Principal rol={userState.rol} />
            </div>
          }/>
          <Route path="/sesion" element={
    <div className={!navVisible ? "page" : "page page-with-navbar"}>
      <Sesion rol={userState.rol} nombre={userState.nombre} userId={userState.userId} />
    </div>
  }/>
 <Route path='/probandoSesion' element={
  <div className={!navVisible ? "page" : "page page-with-navbar"}>
    {userState.rol && userState.nombre ? <ProbandoSesion rol={userState.rol} nombre = {userState.nombre}/> : null}
  </div>
}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;