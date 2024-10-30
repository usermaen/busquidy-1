import React, {useEffect, useRef, useState} from "react"
import "./NavbarFreeLancer.css";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import ProfileCircle from "../ProfileCircle";
import 'bootstrap-icons/font/bootstrap-icons.css';


function NavbarFreeLancer() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para manejar la apertura/cierre del menú en dispositivos móviles
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Estado para manejar la apertura del menú del perfil
    const userInitials = "FE"; //Definir iniciales del usuario
    const profileMenuRef = useRef(null);

    // Función para alternar el estado del menú
    const toggleMenu = () =>  setIsMenuOpen(!isMenuOpen);

    // Función para alternar el estado del menú de perfil
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

    const isActive = (path) => location.pathname == path ? "active" : "";

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('token');  // Eliminar el token del almacenamiento local
        navigate('/');  // Redirigir a la página de inicio de sesión
    };

    // Hook para cerrar el menú cuando se hace click afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false); // Cierra el menú si el click es fuera de él
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileMenuRef]);

    return(
        <header className="navbar-freelancer">
            <div className="navbar-freelancer-logo">
                <Link to="/freelancer">
                    <img src="/images/Busquidy.png" useMap="#image-map" alt="logo"></img>
                </Link>

                {/* Botón del menú hamburguesa */}
                <div className="navbar-freelancer-toggle">
                    <span className="menu-icon" onClick={toggleMenu}>&#9776;</span> {/* Asegúrate de que el botón llame a toggleMenu */}
                </div>
            </div>
            {/* Enlaces del Navbar */}
            <nav className={`navbar-freelancer-links ${isMenuOpen ? 'active' : ''}`}>
                <Link className={isActive("/freelancer")} exact to="/freelancer" style={{color:"black"}}>FreeLancer</Link>
                <Link to="#" style={{color:"#06535794"}}>Busquidy<i className="bi bi-plus"></i></Link>
                <Link to="#" >Sobre Nosotros</Link>
                <Link to="#" >Comunidad</Link>
                <Link to="#" >¡Ayuda!</Link>
            </nav>

            <div className="navbar-freelancer-auth">
            <div className="profile-freelancer-icon" onClick={toggleProfileMenu}>
                <ProfileCircle userInitials="FE" />
            </div>

            <div className={`profile-freelancer-menu ${isProfileMenuOpen ? 'active' : ''}`} ref={profileMenuRef}>
                <ul>
                        <li><Link to="/viewperfilfreelancer"><i className="bi bi-person"></i> Mi perfil</Link></li>
                        <li><Link to="#"><i className="bi bi-file-earmark-text"></i> Crear CV</Link></li>
                        <li><Link to="/mypostulations"><i className="bi bi-file-earmark-text"></i> Mis postulaciones</Link></li>
                        <li><Link to="#"><i className="bi bi-arrow-up-right-circle"></i> Mejorar Busquidy<i className="bi bi-plus"></i></Link></li>
                        <li onClick={handleLogout} style={{cursor: "pointer"}}>
                            <i className="bi bi-box-arrow-right"></i> Cerrar sesión</li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default NavbarFreeLancer;