import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./ViewProjects.css";

function ViewProjects({ userType, id_usuario }) {
    const [projects, setProjects] = useState([]);

    const cargarProyectos = async () => {
        if (userType === 'empresa') {
            try {
                const response = await axios.get(`http://localhost:3001/api/proyectos/${id_usuario}`);
    
                console.log('Respuesta del servidor:', response);
                console.log('Datos de proyectos', response.data);
    
                setProjects(response.data);
            } catch (error) {
                console.error('No se pudo cargar la lista de proyectos');
            }
        } else {
            console.log('Esta función es exclusiva para usuarios de tipo Empresa.');
        }
    };

    // Funciones para gestionar proyectos
    const handleEdit = (id_proyecto) => {
        console.log(`Editar proyecto con ID: ${id_proyecto}`);
        
    };

    const handleDelete = async (id_proyecto) => {
        console.log(`Eliminar proyecto con ID: ${id_proyecto}`);
        try {
            await axios.delete(`http://localhost:3001/api/proyecto/${id_proyecto}`);
            setProjects((prevProjects) => prevProjects.filter((proj) => proj.id_proyecto !== id_proyecto));
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
        }
    };
    

    const handleViewDetails = (id_proyecto) => {
        console.log(`Ver detalles del proyecto con ID: ${id_proyecto}`);
    };

    useEffect(() => {
        if (userType && id_usuario) {
            cargarProyectos();
        }
    }, [userType, id_usuario]);

    return (
        <div className="view-projects-content">
            <h1>Mis Proyectos Publicados</h1>
            <div className="projects-list">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project.id_proyecto} className="project-card">
                            <h3>{project.titulo}</h3>
                            <p>{project.descripcion}</p>
                            <p><strong>Estado:</strong> {project.estado_publicacion}</p> {/* Mostrar estado_publicacion */}
                            <p><strong>Presupuesto:</strong> {project.presupuesto}</p>
                            <div className="project-actions">
                                <button onClick={() => handleViewDetails(project.id_proyecto)}>
                                    <i className="bi bi-info-circle"></i>Ver Detalles
                                </button>
                                <button onClick={() => handleEdit(project.id_proyecto)}>
                                    <i className="bi bi-pencil"></i>Editar
                                </button>
                                <button onClick={() => handleDelete(project.id_proyecto)} className="delete-btn">
                                    <i className="bi bi-trash"></i>Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No has publicado ningún proyecto aún.</p>
                )}
            </div>
        </div>
    );
}

export default ViewProjects;