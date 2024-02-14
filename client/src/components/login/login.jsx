//Importar el hook useState
import { useState, useEffect } from 'react';

//Importar el hook useNavigate
import { useNavigate } from 'react-router-dom';

//Importar axios para hacer peticiones al servidor
import axios from 'axios';

//Importar PropTypes para validar las props que recibe el componente
import PropTypes from 'prop-types';

//Importar el css
import './login.css';
function Login({ authenticate, isAuthenticated }) {

  //Crear objeto navigate para redireccionar a otra ruta
  const navigate = useNavigate();
//Crear el estado para guardar los valores del formulario
const [formLogin, setFormLogin] = useState({
  username: "",
  password: "",
  name: "",
  role: "",
  userId: ""
});

//Crear el estado para guardar el mensaje de error
const [usernameError, setUsernameError] = useState("");
const [passwordError, setPasswordError] = useState("");

//Función para actualizar el estado del formulario
const updateFormLogin = (e) => {
  setFormLogin({
    ...formLogin,
    [e.target.name]: e.target.value
  });
}

//Función para iniciar sesión
const signIn = async (e) => {

  //Evitar que se recargue la página
  e.preventDefault();

  //Restablecer los mensajes de error
  setUsernameError("");
  setPasswordError("");

  //Enviar los datos al servidor para iniciar sesión
  try {

    //Usar axios para hacer una petición POST al servidor con los datos del formulario 
    const res = await axios.post('http://localhost:3000/login', { username: formLogin.username, password: formLogin.password }, 
    { withCredentials: true });
    
    //Si el servidor responde con OK
    if (res.data.status === 'OK') {

      //Obtener el rol del usuario y guardarlo en el estado rol
      const resRole = await axios.get('http://localhost:3000/role', { withCredentials: true });

      //Obtener el nombre del usuario y guardarlo en el estado nombre
      const resName = await axios.get('http://localhost:3000/name', { withCredentials: true });

      //Obtener el ID del usuario y guardarlo en el estado userId
      const resId = await axios.get('http://localhost:3000/userId', { withCredentials: true }); 

      //Actualizar el estado de formLogin con los datos que se obtienen del servidor
      setFormLogin({
        ...formLogin,
        role: resRole.data.trim().toLowerCase(),
        name: resName.data
      });

      //Llama a la funion authenticate que se pasa como prop desde App.jsx
      authenticate(resRole.data.trim().toLowerCase(), resName.data.trim().toLowerCase(), 
      String(resId.data).trim().toLowerCase()); 

    } else if (res.data.status === 'UserNotFound') {
      setUsernameError('El usuario no es correcto');
    } else if (res.data.status === 'IncorrectPassword') {
      setPasswordError('La contraseña no es correcta');
    }
  } catch (error) {
    if (error.response) {
      setUsernameError('Hubo un error al iniciar sesión: ' + error.response);
      setPasswordError('Hubo un error al iniciar sesión: ' + error.response);
    } else {
      setUsernameError('Hubo un error: ' + error);
      setPasswordError('Hubo un error: ' + error);
    }
  }
}

// Redireccionar al usuario cuando esté autenticado
useEffect(() => {
  if (isAuthenticated) {
    navigate('/home');
  }
}, [isAuthenticated, navigate]);

  return (
    <div className="body">
      <div className="box">
        <span className="borderline"></span>
        <form onSubmit={signIn}>
          <h2>Sign in</h2>
          <div className="inputBox">
            <input type="text" name="username" value={formLogin.username} onChange={updateFormLogin} required="required" />
            <span>Username</span>
            <i></i>
          </div>
          {usernameError && <p style={{ color: 'white' }}>{usernameError}</p>}
          <div className="inputBox">
            <input type="password" name="password" value={formLogin.password} onChange={updateFormLogin} required="required" />
            <span>Password</span>
            <i></i>
          </div>
          {passwordError && <p style={{ color: 'white' }}>{passwordError}</p>}
          <div className="links">
          <a href="#">Forgot Password</a>
            <a href="#">Sign up</a>
          </div>
          <input type="submit" value="Login" />
        </form>
      </div>
      ç
    </div>
  );
}
//Validar las props que recibe el componente
Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

//Exportar el componente
export default Login;