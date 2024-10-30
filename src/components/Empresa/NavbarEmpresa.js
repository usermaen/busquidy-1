// NavbarEmpresa.jsx
import React, { useState, useRef, useEffect } from "react";
import "./NavbarEmpresa.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileCircle from "../ProfileCircle";
import 'bootstrap-icons/font/bootstrap-icons.css';

function NavbarEmpresa() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); 
    const profileMenuRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

    const isActive = (path) => location.pathname === path ? "active" : "";

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileMenuRef]);

    return (
        <header className="navbar-empresa">
            <div className="navbar-empresa-logo">
                <Link to="/empresa">
                    <img src="/images/Busquidy.png" alt="logo" />
                </Link>
                <div className="navbar-empresa-toggle">
                    <span className="menu-icon" onClick={toggleMenu}>&#9776;</span>
                </div>
            </div>

            <nav className={`navbar-empresa-links ${isMenuOpen ? 'active' : ''}`}>
                <Link className={isActive("/empresa")} to="/empresa">Empresa</Link>
                <Link to="#">Busquidy<i className="bi bi-plus"></i></Link>
                <Link to="#">Sobre Nosotros</Link>
                <Link to="#">Comunidad</Link>
                <Link to="#">¡Ayuda!</Link>
            </nav>

            <div className="navbar-empresa-auth">
            <div className="profile-empresa-icon" onClick={toggleProfileMenu}>
                <ProfileCircle userInitials="FE" />
            </div>

            <div className={`profile-empresa-menu ${isProfileMenuOpen ? 'active' : ''}`} ref={profileMenuRef}>
                <ul>
                    <li><Link to="/viewperfilempresa"><i className="bi bi-person"></i> Mi perfil</Link></li>
                    <li><Link to="/myprojects"><i className="bi bi-file-earmark-text"></i> Mis publicaciones</Link></li>
                    <li><Link to="#"><i className="bi bi-arrow-up-right-circle"></i> Mejorar Busquidy<i className="bi bi-plus"></i></Link></li>
                    <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                        <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                    </li>
                </ul>
            </div>
        </div>
    </header>
    );
}

export default NavbarEmpresa;
