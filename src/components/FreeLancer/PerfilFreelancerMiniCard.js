import React, { useState, useEffect } from "react";
import "./PerfilFreelancerMiniCard.css";
import axios from "axios";

function PerfilFreelancerMiniCard({ userType, id_usuario }) {
    const [perfilData, setPerfilData] = useState(null);
    const [activeSection, setActiveSection] = useState('freelancer-info');
    
    useEffect(() => {
        cargarPerfilFreelancer();
    }, []);

    const cargarPerfilFreelancer = async () => {
        if (userType === 'freelancer') {
            try {
                const response = await axios.get(`http://localhost:3001/api/perfil-freelancer/${id_usuario}`);
                setPerfilData(response.data);
            } catch (error) {
                console.error('Error al cargar perfil:', error);
            }
        } else {
            console.log('Esta función es exclusiva para usuarios de tipo Freelancer.');
        }
    };

    const renderSection = () => {
        if (!perfilData) return <p>Cargando datos...</p>;

        switch (activeSection) {
            case 'freelancer-info':
                return (
                    <div className="freelancer-info-section">
                        <h2>Información del Freelancer</h2>
                        <p><strong>Nombre:</strong> {perfilData.antecedentesPersonales.nombres} {perfilData.antecedentesPersonales.apellidos}</p>
                        <p><strong>Ciudad:</strong> {perfilData.antecedentesPersonales.ciudad}</p>
                        <p><strong>Descripción:</strong> {perfilData.freelancer.descripcion}</p>
                    </div>
                );
            case 'antecedentes-personales':
                return (
                    <div className="antecedentes-personales-section">
                        <h2>Antecedentes Personales</h2>
                        <p><strong>Rut:</strong> {perfilData.antecedentesPersonales.identificacion}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {perfilData.antecedentesPersonales.fecha_nacimiento}</p>
                        <p><strong>Nacionalidad:</strong> {perfilData.antecedentesPersonales.nacionalidad}</p>
                        <p><strong>Estado Civil:</strong> {perfilData.antecedentesPersonales.estado_civil}</p>
                    </div>
                );
            case 'educacion':
                return (
                    <div className="educacion-section">
                        <h2>Antecendete Educación</h2>
                        <p><strong>Nivel Educacional:</strong> {perfilData.nivelEducacional.nivel_academico} - {perfilData.nivelEducacional.estado}</p>
                        <p><strong>Educación Superior:</strong> {perfilData.educacionSuperior.carrera}, {perfilData.educacionSuperior.ano_inicio} - {perfilData.educacionSuperior.estado}</p>
                        <p><strong>Educación Basica y Media:</strong> {perfilData.educacionBasicaMedia.institucion},  {perfilData.educacionBasicaMedia.tipo}, {perfilData.educacionBasicaMedia.ano_inicio} - {perfilData.educacionBasicaMedia.ano_termino}</p>
                    </div>
                );
            case 'informacion-adicional':
                return (
                    <div className="informacion-adicional-section">
                        <h2>Información Adicional</h2>

                        <p><strong>Experiencia laboral:</strong> {perfilData.trabajoPractica.experiencia_laboral === 'No' 
                            ? perfilData.trabajoPractica.experiencia_laboral 
                            : `${perfilData.trabajoPractica.experiencia_laboral}, ${perfilData.trabajoPractica.area_trabajo}, ${perfilData.trabajoPractica.ano_inicio}`}
                        </p>

                        <p><strong>Emprendimientos:</strong>
                        <br></br>
                            {perfilData.emprendimiento.emprendedor === 'No' 
                                ? ` Emprendedor: ${perfilData.emprendimiento.emprendedor} - Interesado: ${perfilData.emprendimiento.interesado}`
                                : `${perfilData.emprendimiento.emprendedor}, Sector: ${perfilData.emprendimiento.sector_emprendimiento}, Año de inicio: ${perfilData.emprendimiento.ano_inicio}`}
                        </p>

                        <p><strong>Inclusión Laboral:</strong> {perfilData.inclusionLaboral.discapacidad === 'No' 
                            ? perfilData.inclusionLaboral.discapacidad
                            : `${perfilData.inclusionLaboral.discapacidad}, ${perfilData.inclusionLaboral.tipo_discapacidad}`}
                        </p>

                        <p><strong>Idiomas:</strong> {perfilData.idiomas && perfilData.idiomas.length > 0 ? (
                                perfilData.idiomas.map((idioma) => (
                                    <div key={idioma.id_idioma} className="conocimiento-item">
                                        <p>{idioma.idioma} ({idioma.nivel}) 
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No hay idiomas registrados</p>
                            )} 
                        </p>
                    </div>
                );

            // Agrega más casos según tus secciones
            default:
                return null;
        }
    };

    return (
        <div className="perfil-freelancer-container">
            <div className="sidebar-freelancer">
                <ul>
                    <li onClick={() => setActiveSection('freelancer-info')} className={activeSection === 'freelancer-info' ? 'active' : ''}>Información del Freelancer</li>
                    <li onClick={() => setActiveSection('antecedentes-personales')} className={activeSection === 'antecedentes-personales' ? 'active' : ''}>Antecedentes Personales</li>
                    <li onClick={() => setActiveSection('educacion')} className={activeSection === 'educacion' ? 'active' : ''}>Educación</li>
                    <li onClick={() => setActiveSection('informacion-adicional')} className={activeSection === 'informacion-adicional' ? 'active' : ''}>Información Adicional</li>
                    {/* Agrega más items según tus secciones */}
                </ul>
            </div>
            <div className="content">
                {renderSection()}
            </div>
        </div>
    );
}

export default PerfilFreelancerMiniCard;
