import React from "react";
import './Dashboard.css'; // CSS para el Dashboard

function Dashboard() {
    return (
        <div className="dashboard">
            <h1>Panel de Control</h1>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h2>Número Total de Usuarios</h2>
                    <p>500</p> {/* Ejemplo de número */}
                </div>
                <div className="stat-card">
                    <h2>Publicaciones Activas</h2>
                    <p>120</p> {/* Ejemplo de número */}
                </div>
                <div className="stat-card">
                    <h2>Comentarios Recientes</h2>
                    <p>25</p> {/* Ejemplo de número */}
                </div>
                <div className="stat-card">
                    <h2>Estadísticas de Uso</h2>
                    <p>70% de usuarios activos</p> {/* Ejemplo de número */}
                </div>
                <div className="stat-card">
                    <h2>Tareas Pendientes</h2>
                    <p>5</p> {/* Ejemplo de número */}
                </div>
            </div>
            {/* <div className="quick-access">
                <h2>Acceso Rápido</h2>
                <ul>
                    <li><a href="/user-management">Gestión de Usuarios</a></li>
                    <li><a href="/project-management">Gestión de Proyectos/Tareas</a></li>
                    <li><a href="/reviews-management">Reseñas y Calificaciones</a></li>
                    <li><a href="/support-management">Soporte y Moderación</a></li>
                </ul>
            </div> */}
        </div>
    );
}

export default Dashboard;
