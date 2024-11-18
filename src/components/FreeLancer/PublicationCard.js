import React from 'react';
import './PublicationCard.css';

function PublicationCard({ project, onClick, isSelected }) {
  return (
    <div
      className={`publication-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="header">
        <span className="urgent-label">Se precisa Urgente</span>
        <span className="featured-label">Empleo destacado</span>
      </div>
      <h3 className="project-card-title">{project.titulo}</h3>
      <p className="project-card-company">{project.empresa}</p>
      <div className="project-card-details">
        <span className="project-card-location">{project.ubicacion}</span>
        <span className="project-card-salary">Salario: ${project.presupuesto}</span>
      </div>
      <div className="footer-card">
        <span className="project-card-time">Duración: {project.duracion_estimada}</span>
        <span className="project-card-date">Publicado: {project.fecha_publicacion}</span>
      </div>
    </div>
  );
}

export default PublicationCard;
