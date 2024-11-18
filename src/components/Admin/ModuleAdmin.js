import React from "react";
import { Link } from "react-router-dom";
import './ModuleAdmin.css'; // CSS para el módulo

function ModuleAdmin() {
    return (
        <div className="admin-home">
            <h1>Panel de Adminsitración</h1>
            <div className="admin-module">
                {/* Cada Link llevará a su respectiva ruta */}
                <Link to="/usermanagement" className="admin-option">
                    Gestión de Usuarios
                </Link>
                <Link to="/projectmanagement" className="admin-option">
                    Gestión de Proyectos/Tareas
                </Link>
                <Link to="/reviewmanagement" className="admin-option">
                    Reseñas y Calificaciones
                </Link>
                <Link to="/supportmanagement" className="admin-option">
                    Soporte y Moderación
                </Link>
                <Link to="/paymentmanagement" className="admin-option">
                    Pagos y Transacciones
                </Link>
                <Link to="/notificationmanagement" className="admin-option">
                    Anuncios y Notificaciones
                </Link>
                <Link to="/auditandsecurity" className="admin-option">
                    Auditoría y Seguridad
                </Link>
            </div>
        </div>
    );
}

export default ModuleAdmin;
