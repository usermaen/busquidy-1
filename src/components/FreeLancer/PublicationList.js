import React, { useState, useEffect } from 'react';
import './PublicationList.css';
import PublicationCard from './PublicationCard';

const projectData = [
  {
    id: 1,
    title: 'Desarrollador Frontend',
    company: 'TechCompany',
    location: 'Remoto',
    salary: '$1,200.00 USD/mes',
    time: 'Jornada completa',
    rating: 4.5,
    description: 'Buscamos un desarrollador con experiencia en React y CSS.',
  },
  {
    id: 2,
    title: 'Analista QA',
    company: 'Kibernum S.A.',
    location: 'Santiago Centro, R.Metropolitana',
    salary: '$1,000,000.00 (Mensual)',
    time: 'Presencial y remoto',
    rating: 4.2,
    description: 'Estamos buscando un profesional con experiencia en pruebas manuales y automáticas.',
  },

  {
    id: 3,
    title: 'Analista QA',
    company: 'Kibernum S.A.',
    location: 'Santiago Centro, R.Metropolitana',
    salary: '$1,000,000.00 (Mensual)',
    time: 'Presencial y remoto',
    rating: 4.2,
    description: 'Estamos buscando un profesional con experiencia en pruebas manuales y automáticas.',
  },

  {
    id: 4,
    title: 'Analista QA',
    company: 'Kibernum S.A.',
    location: 'Santiago Centro, R.Metropolitana',
    salary: '$1,000,000.00 (Mensual)',
    time: 'Presencial y remoto',
    rating: 4.2,
    description: 'Estamos buscando un profesional con experiencia en pruebas manuales y automáticas.',
  },
  // Agrega más proyectos según sea necesario
];

function PublicationList() {
  const [selectedProject, setSelectedProject] = useState(projectData[0] || null);

  // Asegurarnos de que el primer proyecto se seleccione al cargar la página.
  useEffect(() => {
    if (!selectedProject && projectData.length > 0) {
      setSelectedProject(projectData[0]);
    }
  }, [selectedProject]);

  return (
    <div className='background'>
      <div className="publication-container">
        {/* Sección Izquierda: Lista de Proyectos */}
        <div className="publication-list">
          {projectData.map((project) => (
            <PublicationCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
              isSelected={selectedProject && selectedProject.id === project.id}
            />
          ))}
        </div>

        {/* Sección Derecha: Detalles del Proyecto */}
        <div className="publication-details">
          {selectedProject ? (
            <div className="project-details-card">
              <h2>{selectedProject.title}</h2>
              <p className="project-company">{selectedProject.company}</p>
              <p className="project-rating">Rating: {selectedProject.rating} ⭐</p>
              <p className="project-description">{selectedProject.description}</p>
              <p className="project-location">Ubicación: {selectedProject.location}</p>
              <p className="project-salary">Salario: {selectedProject.salary}</p>
              <p className="project-time">{selectedProject.time}</p>
              <button className="apply-button">Postularme</button>
            </div>
          ) : (
            <p>Selecciona un proyecto para ver los detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicationList;
