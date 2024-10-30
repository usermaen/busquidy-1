import React from 'react';
import './PublicationCard.css';

function PublicationCard({ project, onClick, isSelected }) {
  return (
    <div className={`publication-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="project-summary">
        <h3>{project.title}</h3>
        <p className="project-company">{project.company}</p>
        <span className="project-location">{project.location}</span>
        <span className="project-salary">{project.salary}</span>
        <span className="project-time">{project.time}</span>
      </div>
    </div>
  );
}

export default PublicationCard;
