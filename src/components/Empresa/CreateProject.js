import React, { useState } from "react";
import ModalCreateProject from "./ModalCreateProject"; // Asegúrate de que la ruta sea correcta
import "./CreateProject.css";

function CreateProject() {
    const [showModalProject, setShowModalProject] = useState(false);

    // Aquí deberías obtener el token desde el contexto o el estado global donde se guarda después del inicio de sesión
    const token = localStorage.getItem("token");

    // Función para manejar la creación del proyecto
    const handleCreateProject = async (projectData) => {
        try {
            // Crear un objeto FormData
            const formData = new FormData();
            Object.keys(projectData).forEach((key) => {
                formData.append(key, projectData[key]);
            });

            const response = await fetch("http://localhost:3001/api/create-project", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Solo el token, no agregues el Content-Type
                },
                body: formData, // Enviar el FormData
            });

            if (!response.ok) {
                throw new Error("Error al crear el proyecto");
            }

            const data = await response.json();
            console.log("Proyecto creado con éxito:", data);
            setShowModalProject(false); // Cerrar el modal al completar la creación
        } catch (error) {
            console.error("Error al crear el proyecto:", error);
        }
    };

    // Funciones para abrir/cerrar modal
    const openModalProject = () => setShowModalProject(true);
    const closeModalProject = () => setShowModalProject(false);

    return (
        <div className="background-create">
            <div className="my-projects-content">
                <h1>Crear Proyectos</h1>
                <button className="publish-project-btn" onClick={openModalProject}>
                    Publicar Proyecto
                </button>
            </div>

            {/* Modal para publicar proyecto */}
            {showModalProject && (
                <ModalCreateProject
                    closeModal={closeModalProject}
                    handleCreateProject={handleCreateProject}
                />
            )}
        </div>
    );
}

export default CreateProject;
