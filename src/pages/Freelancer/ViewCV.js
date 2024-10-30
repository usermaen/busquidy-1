// src/pages/ViewCV.js
import React, { useState } from "react";
import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import ResumenCV from "../../components/FreeLancer/ResumenCV";
import CreateCV from "../../components/FreeLancer/CreateCv";
import Modal from "react-modal";
import "./ViewCV.css";

function ViewCV() {
    const [cvData, setCvData] = useState({
        datosPersonales: {},
        experiencia: [],
        educacion: [],
        habilidades: []
    });

    const [isCreateCVModalOpen, setCreateCVModalOpen] = useState(false);

    const handleUpdateCV = (updatedData) => {
        setCvData(updatedData);
    };

    return (
        <div>
            <NavbarFreeLancer />
            <div className="view-cv-container">
                <h1>Mi CV Profesional</h1>

                {/* Vista previa del CV */}
                <ResumenCV cvData={cvData} />

                {/* Botón para abrir el modal de edición */}
                <button onClick={() => setCreateCVModalOpen(true)} className="edit-cv-button">
                    Editar CV
                </button>

                {/* Modal para el componente CreateCV */}
                <Modal 
                    isOpen={isCreateCVModalOpen} 
                    onRequestClose={() => setCreateCVModalOpen(false)}
                    className="create-cv-modal"
                >
                    <CreateCV 
                        cvData={cvData} 
                        onSave={(updatedData) => { 
                            handleUpdateCV(updatedData); 
                            setCreateCVModalOpen(false); 
                        }} 
                    />
                </Modal>
            </div>
        </div>
    );
}

export default ViewCV;
