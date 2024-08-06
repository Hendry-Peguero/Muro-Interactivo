import React, { useState, useEffect } from 'react';
import appFirebase from './credenciales';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// Importación de componentes
import Login from './components/Login';
import Publications from './components/Publications';

import './App.css';

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (usuarioFireBase) => {
      if (usuarioFireBase) {
        setUsuario(usuarioFireBase);
        setMostrarLogin(false); // Cierra el componente Login si el usuario está autenticado
      } else {
        setUsuario(null);
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  const handleLoginSuccess = () => {
    setMostrarLogin(false);
  };

  return (
    <div className="app-container">
      {mostrarLogin ? (
        <Login onAuthSuccess={handleLoginSuccess} />
      ) : (
        <Publications 
          correoUsuario={usuario ? usuario.email : null} 
          handleLogout={handleLogout} 
          onLoginClick={() => setMostrarLogin(true)} 
        />
      )}
    </div>
  );
}

export default App;
