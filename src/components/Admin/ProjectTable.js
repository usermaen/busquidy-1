import React from "react";
import './ProjectTable.css'; // CSS para la tabla

const projects = [
    // Ejemplo de datos de proyectos
    { id: 1, title: "Proyecto 1", status: "Pendiente", assigned: "Freelancer A" },
    { id: 2, title: "Proyecto 2", status: "Aprobado", assigned: "Freelancer B" },
    { id: 3, title: "Proyecto 3", status: "Completado", assigned: "Freelancer C" },
];

function ProjectTable() {
    return (
        <table className="project-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Asignado a</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {projects.map((project) => (
                    <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>{project.title}</td>
                        <td>{project.status}</td>
                        <td>{project.assigned}</td>
                        <td>
                            <button className="approve-btn">Aprobar</button>
                            <button className="reject-btn">Rechazar</button>
                            <button className="edit-btn">Modificar</button>
                            <button className="delete-btn">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ProjectTable;
