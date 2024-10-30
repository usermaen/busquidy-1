import React, { useState } from "react";
import "./Navbar.css";
import Modal from "./Modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
    // Variables para almacenar los valores de correo y contraseña
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showSecondaryModal, setShowSecondaryModal] = useState(false);
    const [showSecondaryRegisterModal, setShowSecondaryRegisterModal] = useState(false);

    // Registro
    const handleRegister = async () => {
        if (!correo || !contraseña || !tipoUsuario) {
            setError("Por favor, completa todos los campos");
            return;
        }
        setError(""); // Limpia errores anteriores

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contraseña, tipo_usuario: tipoUsuario })
            });

            if (response.ok) {
                console.log("Usuario registrado exitosamente");
                setShowSecondaryRegisterModal(false);
            } else {
                console.log("Error al registrar usuario");
            }
        } catch (error) {
            console.error("Error de red: ", error);
        }
    };

    // Almacenamiento de JWT y redirección según tipo de usuario
    const handleLogin = async () => {
        if (!correo || !contraseña) {
            setError("Por favor, ingresa tu correo y contraseña");
            return;
        }
        setError("");

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contraseña })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('token', token);

                // Redirige según tipo de usuario
                if (data.tipo_usuario?.toLowerCase() === 'empresa') {
                    navigate('/empresa');
                } else if (data.tipo_usuario?.toLowerCase() === 'freelancer') {
                    navigate('/freelancer');
                } else {
                    setError("Tipo de usuario desconocido");
                }                
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error de red: ", error);
            setError("Error de red: Intenta de nuevo");
        }
    };

    const fetchProtectedData = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/protected-route', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Datos protegidos: ", data);
        } else {
            console.log("No autorizado");
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleOpenLoginModal = () => {
        setShowRegisterModal(false);
        setShowSecondaryRegisterModal(false);
        setShowSecondaryModal(false);
        setShowLoginModal(true);
    };
    const handleCloseLoginModal = () => setShowLoginModal(false);

    const handleOpenSecondaryModal = () => {
        setShowLoginModal(false);
        setShowSecondaryRegisterModal(false);
        setShowSecondaryModal(true);
    };
    const handleCloseSecondaryModal = () => setShowSecondaryModal(false);

    const handleOpenRegisterModal = () => {
        setShowLoginModal(false);
        setShowSecondaryModal(false);
        setShowSecondaryRegisterModal(false);
        setShowRegisterModal(true);
    };
    const handleCloseRegisterModal = () => setShowRegisterModal(false);

    const handleOpenSecondaryRegisterModal = () => {
        setShowRegisterModal(false);
        setShowSecondaryModal(false);
        setShowSecondaryRegisterModal(true);
    };
    const handleCloseSecondaryRegisterModal = () => setShowSecondaryRegisterModal(false);

    const isActive = (path) => location.pathname === path ? "active" : "";

    return (
        <header className="navbar">
            
            {/* Logo */}
            <div className="navbar-logo">
                <Link to="/">
                    <img src="/images/Busquidy.png" useMap="#image-map" alt="logo" />
                </Link>
                <div className="navbar-toggle">
                    <span className="menu-icon" onClick={toggleMenu}>&#9776;</span>
                </div>
            </div>

            {/* Links del Navbar */}
            <nav className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                <Link className={isActive("/")} exact="true" to="/" style={{color: "black"}}>Inicio</Link>
                <Link to="#" style={{color: "#06535794"}}>Busquidy<i className="bi bi-plus"></i></Link>
                <Link to="#">Sobre Nosotros</Link>
                <Link to="#">Comunidad</Link>
                <Link to="#">¡Ayuda!</Link>
            </nav>

            <div className={`navbar-auth ${isMenuOpen ? 'active' : ''}`}>
                {/* Botón para mostrar el modal login */}
                <button className="btn" onClick={handleOpenLoginModal}>Iniciar sesión</button>

                {/* Modal de inicio de sesión */}
                <Modal show={showLoginModal} onClose={handleCloseLoginModal} dismissOnClickOutside={true}>
                    <div className="modal-split">
                        <div className="modal-left">
                            <h2>El éxito comienza contigo aquí</h2>
                            <ul>
                                <li>Diversas categorías para buscar</li>
                                <li>Trabajo de calidad en tus proyectos</li>
                                <li>Acceso a joven talento profesional</li>
                            </ul>
                        </div>
                        <div className="modal-right">
                            <h2>Inicia sesión en tu cuenta</h2>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <p>¿No tienes una cuenta? <a href="#" onClick={handleOpenRegisterModal}> Registrate aquí</a></p>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                onClick={handleOpenSecondaryModal}>
                                    <i className="bi bi-envelope"></i>

                                Continuar con Correo Electrónico
                            </button>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                className="google">
                                    <i className="bi bi-google"></i>

                                Continuar con Google
                            </button>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                className="apple">
                                    <i className="bi bi-apple"></i>
                                
                                Continuar con Apple
                            </button>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                className="facebook">
                                    <i className="bi bi-facebook"></i>
                                
                                Continuar con Facebook
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Modal secundario de inicio de sesión */}
                <Modal show={showSecondaryModal} onClose={handleCloseSecondaryModal} dismissOnClickOutside={true}>
                    <div className="modal-split">
                        <div className="modal-left">
                            <h2>Continuar con Correo Electrónico</h2>
                            <ul>
                                <li>Inicio de sesión seguro</li>
                                <li>Acceso fácil y rápido</li>
                                <li>Protegeremos tus datos</li>
                            </ul>
                        </div>
                        <div className="modal-right">
                            <button 
                                type="button"
                                style={{ width: "150px", border: "none" }} 
                                className="back-button" 
                                onClick={handleOpenLoginModal}>

                                    ← volver
                            </button>

                            <h3>Ingresa tu correo y contraseña</h3>
                            <input 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                type="email" 
                                placeholder="Correo Electrónico" 
                                value={correo} 
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                            <input 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                type="password" 
                                placeholder="Contraseña" 
                                value={contraseña} 
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                            <a href="#" style={{ marginBottom: "20px" }}>¿Olvidaste tu contraseña?</a>
                            <button 
                                className="primary" 
                                onClick={handleLogin}
                            >
                                Continuar
                            </button>
                            <p>¿No tienes una cuenta? <a href="#" onClick={handleOpenRegisterModal}>Registrate</a></p>
                        </div>
                    </div>
                </Modal>

                {/* Botón para mostrar el modal register*/}
                <button className="btn primary" onClick={handleOpenRegisterModal}>Registrarse</button>

                {/* Modal de registro */}
                <Modal show={showRegisterModal} onClose={handleCloseRegisterModal} dismissOnClickOutside={true}>
                    <div className="modal-split">
                        <div className="modal-left">
                            <h2>El éxito comienza contigo aquí</h2>
                            <ul>
                                <li>Diversas categorías para buscar</li>
                                <li>Trabajo de calidad en tus proyectos</li>
                                <li>Acceso a joven talento profesional</li>
                            </ul>
                        </div>
                        <div className="modal-right">
                            <h2>Crea tu cuenta</h2>
                            <p>¿Ya tienes una cuenta? <a href="#" onClick={handleOpenLoginModal}> Iniciar sesión</a></p>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                onClick={handleOpenSecondaryRegisterModal}>
                                    <i className="bi bi-envelope"></i>
                                    
                                Continuar con Correo Electrónico
                            </button>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }}
                                className="google">
                                    <i className="bi bi-google"></i>

                                Continuar con Google
                            </button>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                className="apple">
                                    <i className="bi bi-apple"></i>
                                
                                Continuar con Apple
                            </button>
                            <button 
                                style={{ width: "400px", marginLeft: "20px" }} 
                                className="facebook">
                                    <i className="bi bi-facebook"></i>
                                    
                                Continuar con Facebook
                            </button>
                            <div className="divider-wrapper">
                                <div className="divider">
                                    <span >O</span>
                                </div>
                            </div>
                            <div className="terms-container">
                                <p>Al unirte, aceptas los <a href="#">Términos de servicio</a> de la plataforma, así como recibir correos electrónicos ocasionales. Lee nuestra <a href="#">Política de privacidad</a> para saber cómo utilizamos tus datos personales.</p>
                            </div>
                        </div>
                    </div>
                </Modal>

                 {/* Modal secundario de registro */}
            <Modal show={showSecondaryRegisterModal} onClose={handleCloseSecondaryRegisterModal} dismissOnClickOutside={true}>
                <div className="modal-split">
                    <div className="modal-left">
                        <h2>Continuar con Correo Electrónico</h2>
                        <ul>
                            <li>Registro fácil y rápido</li>
                            <li>Acceso seguro a nuestra plataforma</li>
                            <li>Tu privacidad es nuestra prioridad</li>
                        </ul>
                    </div>
                    <div className="modal-right">
                        <button style={{ width: "150px", border: "none" }} className="back-button" onClick={handleOpenRegisterModal}>← volver</button>
                        <h3>Ingresa tu correo, contraseña y tipo de usuario</h3>

                        <select 
                            id="tipoUsuario" 
                            name="tipoUsuario" 
                            value={tipoUsuario} 
                            onChange={(e) => setTipoUsuario(e.target.value)} 
                            style={{ width: "400px", marginLeft: "20px" }}
                        >
                            <option value="">Tipo de Usuario</option>
                            <option value="empresa">Empresa</option>
                            <option value="freelancer">Freelancer</option>
                        </select>

                        <input 
                            style={{ width: "400px", marginLeft: "20px" }} 
                            type="email" 
                            placeholder="Correo Electrónico" 
                            value={correo} 
                            onChange={(e) => setCorreo(e.target.value)} 
                        />
                        <input 
                            style={{ width: "400px", marginLeft: "20px" }} 
                            type="password" 
                            placeholder="Contraseña" 
                            value={contraseña} 
                            onChange={(e) => setContraseña(e.target.value)} 
                        />
                        <button 
                            className="primary" 
                            onClick={handleRegister}
                        >
                            Continuar
                        </button>
                        <p>¿Ya tienes una cuenta? <a href="#" onClick={handleOpenLoginModal}>Iniciar sesión</a></p>
                    </div>
                </div>
            </Modal>
            </div>
        </header>
    );
}

export default Navbar;
