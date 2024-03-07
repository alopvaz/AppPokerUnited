import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login.css';

function Login({ authenticate, isAuthenticated }) {

  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
    name: "",
    role: "",
    userId: ""
  });

  const updateFormLogin = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value
    });
  }

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://192.168.20.103:3000/login', formLogin, { withCredentials: true });

      if (res.data.status === 'OK') {
        const resRole = await axios.get('http://192.168.20.103:3000/role', { withCredentials: true });
        const resName = await axios.get('http://192.168.20.103:3000/name', { withCredentials: true });
        const resId = await axios.get('http://192.168.20.103:3000/userId', { withCredentials: true }); 
        setFormLogin({
          ...formLogin,
          role: resRole.data.trim().toLowerCase(),
          name: resName.data
        });

        Cookies.set('isAuthenticated', 'true');
        Cookies.set('role', resRole.data.trim().toLowerCase());
        Cookies.set('name', resName.data.trim().toLowerCase());
        Cookies.set('userId', String(resId.data).trim().toLowerCase());

        authenticate(resRole.data.trim().toLowerCase(), resName.data.trim().toLowerCase(), 
        String(resId.data).trim().toLowerCase()); 

        navigate('/home'); // Navega al usuario a la página de inicio

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
          <h1>Sign in</h1>
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
    </div>
  );
}

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Login;