import React, { useState, useEffect } from 'react';
import PublicationCard from './PublicationCard';
import MessageModal from "../MessageModal";
import './PublicationList.css';
import axios from 'axios';

function PublicationList({ userType }) {
    const [publications, setPublications] = useState([]);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');

    const openModalProject = () => {
        if (userType === 'freelancer') {
            setMessage('Has aplicado a este proyecto.');
        } else if (userType === 'empresa') {
            setMessage('Esta función es exclusiva para usuarios de tipo Freelancer.');
        } else {
            setMessage('Debes iniciar sesión como Freelancer para desbloquear esta función.');
        }
        setShowMessageModal(true);
    };

    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    const cargarPublicaciones = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/publicacion');
            const proyectosActivos = response.data.filter(proyecto => proyecto.estado_publicacion === 'activo');
            console.log('Proyectos activos:', proyectosActivos);
            setPublications(proyectosActivos);
        } catch (error) {
            console.error('Error al cargar la lista de proyectos publicados:', error);
        }
    };

    useEffect(() => {
        cargarPublicaciones();
    }, []);

    return (
      <div className="color-findfreelancer">
          <div className='publication-list-container'>
              <div className="publication-list">
                  {publications.length > 0 ? (
                      publications.map((publication) => (
                          <PublicationCard
                              key={publication.id_publicacion}
                              project={publication}
                              onClick={() => setSelectedPublication(publication)}
                              isSelected={selectedPublication && selectedPublication.id_publicacion === publication.id_publicacion}
                          />
                      ))
                  ) : (
                      <p className="no-publications-message">No se encontraron publicaciones de proyectos.</p>
                  )}
              </div>

              <div className="publication-details">
                  {selectedPublication ? (
                      <div className="project-details-card">
                          <h2>{selectedPublication.titulo}</h2>
                          <p className="project-company">{selectedPublication.empresa}</p>
                          <p className="project-rating">Rating: {selectedPublication.rating} ⭐</p>
                          <p className="project-description">{selectedPublication.descripcion}</p>
                          <p className="project-location">Ubicación: {selectedPublication.ubicacion}</p>
                          <p className="project-salary">Salario: {selectedPublication.presupuesto}</p>
                          <p className="project-time">Tiempo estimado: {selectedPublication.duracion_estimada}</p>
                          <p className="project-status">Estado: {selectedPublication.estado_publicacion}</p>
                          <button className="apply-button" onClick={openModalProject}>Postularme</button>
                      </div>
                  ) : (
                      <p className="no-details-message">Selecciona un proyecto para ver los detalles.</p>
                  )}
              </div>

              {showMessageModal && (
                  <MessageModal message={message} closeModal={closeMessageModal} />
              )}
          </div>
      </div>
    );
}

export default PublicationList;
