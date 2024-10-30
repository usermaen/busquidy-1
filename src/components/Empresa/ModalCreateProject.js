import React, { useState } from "react";
import './ModalCreateProject.css';

function ModalCreateProject({ closeModal, handleCreateProject  }) {
    const [currentStep, setCurrentStep] = useState(1);

    // Estado para guardar datos del proyecto
    const [projectData, setProjectData] = useState({
        projectName: "",
        description: "",
        category: "",
        skills: "",
        budget: "",
        duration: "",
        deadline: "",
        location: "",
        contractType: "",
        methodology: "",
        attachment: null, // Para archivo adjunto
        visibility: "",
    });

    // Captura cambios en los inputs
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProjectData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    // Enviar datos del proyecto al backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Llamar a la función pasada desde el componente padre
        handleCreateProject(projectData);
    };

    // Función para avanzar y retroceder en los pasos del formulario
    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    return (
        <div className="modal-project-overlay">
            <div className="modal-project-content">
                <h2>Publicar Proyecto</h2>
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className="form-step">
                            <h3>Información del Proyecto</h3>
                            <div className="form-group">
                                <label htmlFor="projectName">Título del Proyecto o Tarea</label>
                                <input
                                    type="text"
                                    id="projectName"
                                    name="projectName"
                                    placeholder="Ej: Desarrollo de aplicación web"
                                    value={projectData.projectName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Descripción Detallada</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Descripción del proyecto"
                                    value={projectData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Categoría del Proyecto</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={projectData.category}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "725px" }}
                                >
                                    <option value="dev">Desarrollo Web</option>
                                    <option value="design">Diseño Gráfico</option>
                                    <option value="marketing">Marketing Digital</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="form-step">
                            <h3>Detalles Adicionales</h3>
                            <div className="form-group">
                                <label htmlFor="skills">Habilidades Requeridas</label>
                                <input
                                    type="text"
                                    id="skills"
                                    name="skills"
                                    placeholder="Ej: React, Node.js, etc."
                                    value={projectData.skills}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="budget">Presupuesto Estimado</label>
                                <input
                                    type="number"
                                    id="budget"
                                    name="budget"
                                    placeholder="Monto en USD"
                                    value={projectData.budget}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration">Duración Estimada</label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    placeholder="Ej: 2 semanas, 1 mes"
                                    value={projectData.duration}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deadline">Fecha Límite de Entrega</label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={projectData.deadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="form-step">
                            <h3>Información Adicional</h3>
                            <div className="form-group">
                                <label htmlFor="location">Ubicación del Proyecto</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="Remoto o especificar ubicación"
                                    value={projectData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contractType">Tipo de Contratación</label>
                                <select
                                    id="contractType"
                                    name="contractType"
                                    value={projectData.contractType}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "725px" }}
                                >
                                    <option value="project">Por Proyecto</option>
                                    <option value="hourly">Por Hora</option>
                                    <option value="longterm">A Largo Plazo</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="methodology">Metodología de Trabajo</label>
                                <input
                                    type="text"
                                    id="methodology"
                                    name="methodology"
                                    placeholder="Ej: Scrum, Kanban"
                                    value={projectData.methodology}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="attachment">Archivos Adjuntos</label>
                                <input
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="visibility">Visibilidad del Proyecto</label>
                                <select
                                    id="visibility"
                                    name="visibility"
                                    value={projectData.visibility}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "725px" }}
                                >
                                    <option value="public">Público</option>
                                    <option value="private">Privado</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={closeModal}>Cancelar</button>
                        {currentStep > 1 && <button type="button" onClick={prevStep}>Anterior</button>}
                        {currentStep < 3 && (
                            <button type="button" className="next-btn" onClick={nextStep}>
                                Siguiente
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button type="submit" className="next-btn">
                                Publicar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCreateProject;
