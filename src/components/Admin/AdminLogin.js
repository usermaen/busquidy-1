import React, { useState } from 'react';
import "./AdminLogin.css"

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación más adelante
    alert('Iniciar sesión con:\nEmail: ' + email + '\nContraseña: ' + password);
  };

  return (
    <div className='login-container'>
        <h1>Inicio de sesión Administrador</h1>
        <form onSubmit={handleLogin}>
            <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button to="#">Entrar</button>
        </form>
    </div>
  );
};

export default AdminLogin;
