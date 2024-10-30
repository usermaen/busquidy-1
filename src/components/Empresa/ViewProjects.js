import React, { useState } from "react";
import "./ViewProjects.css";

function ViewProjects() {
    const [projects, setProjects] = useState([
        // Ejemplo de proyectos para mostrar
        {
            id: 1,
            title: "Desarrollo de aplicación web",
            description: "Aplicación para gestionar tareas diarias.",
            status: "Activo",
            budget: "$3000",
        },

        {
            id: 2,
            title: "Diseño gráfico para redes sociales",
            description: "Diseño de posts para Instagram y Facebook.",
            status: "Completado",
            budget: "$1500",
        },
        // Puedes agregar más proyectos aquí
    ]);

    // Funciones para gestionar proyectos
    const handleEdit = (projectId) => {
        console.log(`Editar proyecto con ID: ${projectId}`);
    };

    const handleDelete = (projectId) => {
        console.log(`Eliminar proyecto con ID: ${projectId}`);
        // Aquí podrías agregar una lógica para eliminar el proyecto del estado
    };

    const handleViewDetails = (projectId) => {
        console.log(`Ver detalles del proyecto con ID: ${projectId}`);
    };

    return (
        <div className="view-projects-content">
            <h1>Mis Proyectos Publicados</h1>
            <div className="projects-list">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <p><strong>Estado:</strong> {project.status}</p>
                            <p><strong>Presupuesto:</strong> {project.budget}</p>
                            <div className="project-actions">
                                <button onClick={() => handleViewDetails(project.id)}>
                                    <i className="bi bi-info-circle"></i>Ver Detalles
                                </button>
                                <button onClick={() => handleEdit(project.id)}>
                                    <i className="bi bi-pencil"></i>Editar
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="delete-btn">
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
