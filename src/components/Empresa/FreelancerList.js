import React, { useState, useEffect } from "react";
import "./FreelancerList.css";
import MessageModal from "../MessageModal";
import axios from "axios";

function FreelancerList({ userType, id_usuario }) {
    const [freelancers, setFreelancers] = useState([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');

    const openModalProject = () => {
        if (userType === 'empresa') {
            // Acción para empresa (ej. contactar freelancer)
        } else if (userType === 'freelancer') {
            setMessage('Esta función es exclusiva para usuarios de tipo empresa.');
            setShowMessageModal(true);
        } else {
            setMessage('Debes iniciar sesión como empresa para desbloquear esta función.');
            setShowMessageModal(true);
        }
    };

    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    const cargarFreelancers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/freelancer');
            const freelancerData = response.data.map(freelancer => ({
                id: freelancer.id_freelancer,
                nombre: freelancer.nombre,
                apellido: freelancer.apellido,
                nacionalidad: freelancer.nacionalidad,
                ubicacion: `${freelancer.ciudad}, ${freelancer.comuna}`,
                calificacion: freelancer.calificacion_promedio,
                descripcion: freelancer.descripcion
            }));
            setFreelancers(freelancerData);
        } catch (error) {
            console.error('Error al cargar la lista de freelancers:', error);
        }
    };

    const verificarPerfilFreelancer = async () => {
        if (userType === 'freelancer') {
            try {
                const response = await axios.get(`http://localhost:3001/api/freelancer/${id_usuario}`);
                if (response.data.isPerfilIncompleto) {
                    setMessage('Completa tu perfil para aparecer en la lista de freelancers.');
                    setShowMessageModal(true);
                }
            } catch (error) {
                console.error("Error al verificar el perfil del freelancer:", error);
            }
        }
    };    

    useEffect(() => {
        cargarFreelancers();
        if (id_usuario && userType === 'freelancer') {
            verificarPerfilFreelancer();
        }
    }, [id_usuario, userType]);
    

    return (
        <div className="background-freelancer-list">
            <div className="cards-freelancer-container">
                {freelancers.length > 0 ? (
                    freelancers.map((freelancer) => (
                        <div key={freelancer.id} className="card-freelancer">
                            <div className="card-freelancer-header">
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="Freelancer"
                                    className="card-freelancer-image"
                                />
                                <div className="freelancer-info-header">
                                    <h3>{freelancer.nombre} {freelancer.apellido}</h3>
                                    <p className="location">
                                        <i className="fas fa-map-marker-alt"></i> {freelancer.ubicacion}
                                    </p>
                                    <div className="ratings">
                                        <span className="stars">⭐⭐⭐⭐⭐</span> {/* Placeholder para calificación */}
                                        <span className="reviews">({freelancer.calificacion})</span>
                                        <span className="verified">
                                            <i className="fas fa-check-circle"></i> Identidad verificada
                                        </span>
                                        <span className="popular">
                                            <i className="fas fa-fire"></i> Popular
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-freelancer-info">
                                <p>{freelancer.descripcion}</p>
                                <div className="card-freelancer-buttons">
                                    <button className="view-profile" onClick={openModalProject}>Ver Perfil</button>
                                    <button className="apply" onClick={openModalProject}>Contactar</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron freelancers.</p>
                )}
            </div>
            {/* Modal para mensajes */}
            {showMessageModal && (
                <MessageModal message={message} closeModal={closeMessageModal} />
            )}
        </div>
    );
}

export default FreelancerList;
