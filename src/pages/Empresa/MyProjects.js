import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Home/Navbar";
import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import CreateProject from "../../components/Empresa/CreateProject";
import ViewProjects from "../../components/Empresa/ViewProjects";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen"; 
import "./MyProjects.css"

function MyProjects() {
    // Estado para determinar si el usuario está autenticado
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Estado para la pantalla de carga
    const [loading, setLoading] = useState(true); 
    // Estado para los mensajes de logout
    const [logoutStatus, setLogoutStatus] = useState("");
    // Estado para el tipo de usuario
    const [userType, setUserType] = useState(null);
    // Estado para el id usuario
    const [id_usuario, setIdUsuario] = useState(null);
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate(); 

    const cargarProyectos = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/proyectos/${id_usuario}`);
            setProjects(response.data);
        } catch (error) {
            console.error("Error al cargar los proyectos:", error);
        }
    };

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');    
            setIsAuthenticated(!!token);

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log("Decoded token:", decoded);
                    setUserType(decoded.tipo_usuario);
                    setIdUsuario(decoded.id_usuario)
                } catch (error) {
                    console.error("Error decodificando el token:", error);
                }
            }

            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
     
        window.addEventListener('storage', checkAuth);
        checkAuth();
    
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
        if (id_usuario) {
            console.log("ID usuario actualizado:", id_usuario);
        }
    }, [id_usuario]); // Este useEffect se ejecuta cuando id_usuario cambia

    const handleLogout = () => {
        setLoading(true); // Muestra la pantalla de carga al cerrar sesión
        setLogoutStatus("Cerrando sesión...");
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("correo");
            setIsAuthenticated(false);
            setUserType(null);
            setLogoutStatus("Sesión cerrada");
            setTimeout(() => {
                setLoading(false); // Oculta la pantalla de carga antes de redirigir
                navigate("/");
            }, 1000); // Reduce este timeout si es necesario
        });
    };

    // Renderización condicional del navbar según el tipo de usuario
    const renderNavbar = () => {
        if (!isAuthenticated) {
            return <Navbar />;
        }
        if (userType === "empresa") {
            return <NavbarEmpresa onLogout={handleLogout} />;
        }
        if (userType === "freelancer") {
            return <NavbarFreeLancer onLogout={handleLogout} />;
        }
        // En caso de que no haya un tipo de usuario válido (prevención)
        return <Navbar />;
    };
    
    return (
        <div style={{marginTop:"80px"}}>
            {/* Muestra la pantalla de carga si está activa */}
            {loading && <LoadingScreen />}

            {/* Renderiza el navbar correcto */}
            {renderNavbar()}

            <div className="background-color-myproject">
                <ViewProjects userType={userType} id_usuario={id_usuario}/>

                {/* Se pasa el userType como prop */}
                <CreateProject userType={userType} id_usuario={id_usuario} onProjectCreated={cargarProyectos} />
                <Footer/>

                {/* Mensaje de estado de cierre de sesión */}
                {logoutStatus && (
                    <div className="logout-status">
                        {logoutStatus}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProjects;
