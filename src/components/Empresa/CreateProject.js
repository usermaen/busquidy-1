import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalCreateProject from "./ModalCreateProject";
import MessageModal from "../MessageModal";
import "./CreateProject.css";

function CreateProject({ userType, id_usuario, cargarProyectos }) {
    const [showModalProject, setShowModalProject] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Verifica si el perfil está completo o no, después de que `isPerfilIncompleto` cambie
        if (isPerfilIncompleto !== null) {
            if (isPerfilIncompleto === false) {
                setShowModalProject(true);
                setIsPerfilIncompleto(null);
            } else if (isPerfilIncompleto === true) {
                setMessage('Por favor, completa tu perfil de empresa antes de crear un proyecto.');
                setShowMessageModal(true);
            }
        }
    }, [isPerfilIncompleto]); // Este efecto se ejecuta cuando cambia `isPerfilIncompleto`

    const openModalProject = async () => {
        if (userType === 'empresa') {
            try {
                const response = await axios.get(`http://localhost:3001/api/empresa/${id_usuario}`);
                
                if (response.data && typeof response.data.isPerfilIncompleto === "boolean") {
                    setIsPerfilIncompleto(response.data.isPerfilIncompleto);
                } else {
                    console.error("La respuesta del servidor no es la esperada:", response.data);
                    setMessage('Error al verificar el perfil de la empresa. Inténtalo de nuevo más tarde.');
                    setShowMessageModal(true);
                }

            } catch (error) {
                console.error("Error al verificar el perfil de la empresa:", error);
                setMessage('Error al verificar el perfil de la empresa. Inténtalo de nuevo más tarde.');
                setShowMessageModal(true);
            }
        } else if (userType === 'freelancer') {
            setMessage('Esta función es exclusiva para usuarios de tipo Empresa.');
            setShowMessageModal(true);
        } else {
            setMessage('Debes iniciar sesión como Empresa para desbloquear esta función.');
            setShowMessageModal(true);
        }
    };

    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    return (
        <div className="background-create">
            <div className="my-projects-content">
                <h1>Crear Proyectos</h1>
                <button className="publish-project-btn" onClick={openModalProject}>
                    Publicar Proyecto
                </button>
            </div>

            {showModalProject && (
                <ModalCreateProject 
                    closeModal={() => setShowModalProject(false)} 
                    id_usuario={id_usuario} 
                    cargarProyectos={cargarProyectos}
                />
            )}

            {showMessageModal && (
                <MessageModal message={message} closeModal={closeMessageModal} />
            )}
        </div>
    );
}

export default CreateProject;
