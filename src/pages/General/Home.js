import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Home/Navbar";
import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import CardSection from "../../components/Home/CardSection";
import InfoSectionHome from "../../components/Home/InfoSectionHome";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen";

function Home() {
    // Estado para determinar si el usuario está autenticado
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Estado para la pantalla de carga
    const [loading, setLoading] = useState(true);
    // Estado para los mensajes de logout
    const [logoutStatus, setLogoutStatus] = useState("");
    // Estado para el tipo de usuario
    const [userType, setUserType] = useState(null);
    // Para redirigir al usuario después del logout
    const navigate = useNavigate(); 

    // Verificar autenticación y el tipo de usuario
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token); // Verifica si hay un token
    
            if (token) {
                try {
                    const decoded = jwtDecode(token); // Decodifica el token para obtener el tipo de usuario
                    setUserType(decoded.tipo_usuario); // Asegúrate de que 'tipo_usuario' esté en el token
                } catch (error) {
                    console.error("Error decodificando el token:", error);
                }
            } else {
                setUserType(null); // Si no hay token, resetear el tipo de usuario
            }
    
            setLoading(false); // Detener pantalla de carga
        };
    
        checkAuth(); // Llama a la función para verificar autenticación
    
    }, []); // Solo una vez al montar el componente
    

    // Función para manejar el estado de logout y mostrar el mensaje
    const handleLogoutStatus = (status) => {
        setLogoutStatus(status); // Actualiza el mensaje de estado de logout
        setTimeout(() => setLogoutStatus(""), 5000); // Limpia el mensaje después de 5 segundos
    };

    // Función para manejar el logout completo
    const handleLogout = () => {
        setLoading(true);
        handleLogoutStatus("Cerrando sesión..."); // Muestra el mensaje de cierre de sesión
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("correo"); // Remueve los datos de autenticación
            setIsAuthenticated(false); // Actualiza el estado de autenticación
            setUserType(null); // Resetea el tipo de usuario
            handleLogoutStatus("Sesión cerrada"); // Muestra que la sesión se cerró
            setTimeout(() => {
                setLoading(false);
                navigate("/"); // Redirige a la página de inicio después del mensaje
            }, 3000); // Aumenta el tiempo para que se vea el mensaje
        }); // Simula un breve retraso para el cierre de sesión
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
        return <Navbar />;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <div className="main-content" style={{ flex: 1, marginTop: "80px" }}>

                {/* Muestra la pantalla de carga si está activa */}
                {loading && <LoadingScreen />}

                {/* Renderiza el navbar correcto */}
                {renderNavbar()}

                <CardSection userType={userType} />
                <InfoSectionHome />
                <Footer />

                {/* Mensaje de estado de cierre de sesión */}
                {logoutStatus && (
                    <div className="logout-status">
                        {logoutStatus}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
