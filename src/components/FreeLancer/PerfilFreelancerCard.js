import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PerfilFreelancerCard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function PerfilFreelancerCard({ userType, id_usuario }) {
    const [perfilFreelancerData, setPerfilFreelancerData] = useState(null);
    const [progresoPerfil, setProgresoPerfil] = useState(0);  // Progreso total del perfil
    const [seccionesCompletas, setSeccionesCompletas] = useState({});
    const [activeSection, setActiveSection] = useState("informacionGeneral");

    useEffect(() => {
        cargarPerfilFreelancer();
    }, []);

    // Función para cargar los datos del perfil desde el backend
    const cargarPerfilFreelancer = async () => {
        if (userType === 'freelancer') {
            try {
                const response = await axios.get(`http://localhost:3001/api/perfil-freelancer/${id_usuario}`);
                setPerfilFreelancerData(response.data);
                calcularProgreso(response.data);  // Calcula el progreso del perfil
            } catch (error) {
                console.error('Error al cargar perfil:', error);
            }
        } else {
            console.log('Esta función es exclusiva para usuarios de tipo Freelancer.');
        }
    };

    // Calcula el progreso y estado de cada sección
    const calcularProgreso = (data) => {
        const secciones = {
            informacionGeneral: data.antecedentesPersonales && data.antecedentesPersonales.nombres && data.antecedentesPersonales.apellidos,
            presentacion: data.freelancer && data.freelancer.descripcion,
            inclusionLaboral: data.inclusionLaboral && data.inclusionLaboral.discapacidad,
            experienciaLaboral: data.experienciaLaboral && data.experienciaLaboral.length > 0,
            formacion: data.nivelEducacional && data.nivelEducacional.nivel_academico,
            conocimientos: data.curso && data.curso.nombre_curso,
            pretensiones: data.pretensiones && data.pretensiones.disponibilidad && data.pretensiones.renta_esperada,
        };

        // Calcula el porcentaje completado
        const totalCompletadas = Object.values(secciones).filter(Boolean).length;
        const progreso = (totalCompletadas / Object.keys(secciones).length) * 100;

        setProgresoPerfil(progreso);
        setSeccionesCompletas(secciones);
    };

    const editarDatos = (field) => {
        console.log(`Editar datos de ${field}`);
        // Implementación para abrir modal o formulario de edición
    };

    const handleNavigation = (section) => {
        setActiveSection(section);
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

    const agregarIdioma = () => {
        console.log(`Agregar idioma de `);
        // Implementación para abrir modal o formulario de edición
    };

    const eliminarIdioma = () => {
        console.log(`elimar idioma `);
        // Implementación para abrir modal o formulario de edición
    };

    const agregarHabilidad = () => {
        console.log(`Agregar idioma de `);
        // Implementación para abrir modal o formulario de edición
    };

    const eliminarHabilidad = () => {
        console.log(`elimar idioma `);
        // Implementación para abrir modal o formulario de edición
    };

    return (
        <div className="perfil-free-container">
            {/* Información General */}
            <div className="perfil-info">
                <h2>Información General</h2>
                {perfilFreelancerData ? (
                    <>
                        <div className="mini-card">
                        <div id="informacionGeneral" className={` ${activeSection === "informacionGeneral" ? "active" : ""}`}>  
                                <p><strong>DNI:</strong> {perfilFreelancerData.antecedentesPersonales.identificacion}</p>
                                <p><strong>Nombre completo:</strong> {perfilFreelancerData.antecedentesPersonales.nombres} {perfilFreelancerData.antecedentesPersonales.apellidos}</p>
                                <p><strong>Correo electrónico:</strong> {perfilFreelancerData.usuario.correo}</p>
                                <p><strong>Fecha de nacimiento:</strong> {perfilFreelancerData.antecedentesPersonales.fecha_nacimiento}</p>
                                <p><strong>Ubicación:</strong> {perfilFreelancerData.antecedentesPersonales.ciudad}, {perfilFreelancerData.antecedentesPersonales.comuna}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("informacionGeneral")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <h2>Presentación</h2>
                        <div className="mini-card">
                            <div id="presentacion" className={` ${activeSection === "presentacion" ? "active" : ""}`}> 
                                <p>{perfilFreelancerData.freelancer.descripcion}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("presentacion")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <h2>Inclusión Laboral</h2>
                        <div className="mini-card">
                            <div id="inclusionLaboral" className={` ${activeSection === "inclusionLaboral" ? "active" : ""}`}> 
                                <p><strong>Discapacidad:</strong> {perfilFreelancerData.inclusionLaboral.discapacidad}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("inclusionLaboral")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <h2>Experiencia Laboral</h2>
                        <div className="mini-card">
                        <h3>Emprendimientos</h3>
                            <div id="experienciaLaboral" className={` ${activeSection === "experienciaLaboral" ? "active" : ""}`}>
                                <p><strong>Emprendedor:</strong> {perfilFreelancerData.emprendimiento.emprendedor}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("experienciaLaboral")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <div className="mini-card-agregar">
                            <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar Emprendimiento</button>
                        </div>

                        <div className="mini-card">
                        <h3>Trabajo y Práctica</h3>
                            <div className="trabajoPractica">
                                <p><strong>Experiencia laboral:</strong> {perfilFreelancerData.trabajoPractica.experiencia_laboral}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("experienciaLaboral")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <div className="mini-card-agregar">
                            <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar Práctica o Trabajo</button>
                        </div>

                        <h2>Formación</h2>
                        <div className="mini-card">
                        <h3>Nivel Educacional</h3>
                            <div id="formacion" className={` ${activeSection === "formacion" ? "active" : ""}`}>
                                <p><strong>Nivel académico:</strong> {perfilFreelancerData.nivelEducacional.nivel_academico}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("formacion")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <div className="mini-card">
                        <h3>Educación Superior</h3>
                            <div className="educacion-superior">
                                <p><strong>Nivel académico:</strong> {perfilFreelancerData.educacionSuperior.carrera}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("educacionSuperior")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <div className="mini-card-agregar">
                            <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar Educación Superior</button>
                        </div>

                        <div className="mini-card">
                        <h3>Educación Básica y Media</h3>
                            <div className="educacion-basica-media">
                                <p><strong>Nivel académico:</strong> {perfilFreelancerData.educacionBasicaMedia.tipo}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("educacionBasicaMedia")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <h2>Conocimientos</h2>
                        <div className="mini-card">
                        <h3>Cursos</h3>
                            <div id="conocimientos" className={` ${activeSection === "conocimientos" ? "active" : ""}`}>
                                <p><strong>Nivel académico:</strong> {perfilFreelancerData.curso.nombre_curso}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("conocimientos")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <div className="mini-card-agregar">
                            <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar curso</button>
                        </div>

                        {/* Idiomas */}
                        <div id="idiomas" className={`mini-card ${activeSection === "idiomas" ? "active" : ""}`}>
                            <h3>Idiomas</h3>
                            {perfilFreelancerData.idiomas && perfilFreelancerData.idiomas.length > 0 ? (
                                perfilFreelancerData.idiomas.map((idioma) => (
                                    <div key={idioma.id_idioma} className="conocimiento-item">
                                        <span>{idioma.idioma} ({idioma.nivel}) 
                                            <button className="btn-eliminar" onClick={() => eliminarIdioma(idioma.id_idioma)}>✖</button>
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No hay idiomas registrados</p>
                            )}
                            <button className="btn-agregar-conocimiento" onClick={agregarIdioma}>
                                <i className="fas fa-plus"></i>Agregar
                            </button>
                        </div>

                        {/* Habilidades */}
                        <div id="habilidades" className={`mini-card ${activeSection === "habilidades" ? "active" : ""}`}>
                            <h3>Habilidades</h3>
                            {perfilFreelancerData.habilidades && perfilFreelancerData.habilidades.length > 0 ? (
                                perfilFreelancerData.habilidades.map((habilidad) => (
                                    <div key={habilidad.id_habilidad} className="conocimiento-item">
                                        <span>{habilidad.habilidad} ({habilidad.nivel}) 
                                            <button className="btn-eliminar" onClick={() => eliminarHabilidad(habilidad.id_habilidad)}>✖</button>
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No hay habilidades registradas</p>
                            )}
                            <button className="btn-agregar-conocimiento" onClick={agregarHabilidad}>
                                <i className="fas fa-plus"></i>Agregar
                            </button>
                        </div>

                        <h2>Pretensiones</h2>
                        <div className="mini-card">
                            <div id="pretensiones" className={` ${activeSection === "pretensiones" ? "active" : ""}`}>
                                <p><strong>Disponibilidad:</strong> {perfilFreelancerData.pretensiones.disponibilidad}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("pretensiones")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>

                        <div className="mini-card">
                            <div className="educacion-basica-media">
                                <p><strong>Renta esperada:</strong> {perfilFreelancerData.pretensiones.renta_esperada}</p>
                            </div>
                            <button className="btn-editar" onClick={() => editarDatos("educacionBasicaMedia")}>
                                <i className="fas fa-edit"></i>Editar
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Cargando datos...</p>
                )}
            </div>

            {/* Lado derecho (perfil-sidebar) */}
            <div className="perfil-sidebar">
                <h2 style={{ textAlign: "center" }}>Foto de Perfil</h2>
                <div className="foto-perfil">
                    <img src="https://via.placeholder.com/150" alt="Foto de perfil" />
                    <button className="btn-cambiar-foto"><i className="fas fa-edit"></i> Cambiar Foto</button>
                </div>

                {/* Barra de progreso */}
                <div className="completitud">
                    <p>{progresoPerfil.toFixed(0)}%</p>
                    <div className="barra-progreso">
                        <div className="progreso" style={{ width: `${progresoPerfil}%` }}></div>
                    </div>
                    <p className="completitud-mensaje">Este porcentaje de completitud es solo una referencia. Completa tu perfil para mejorar tu visibilidad.</p>
                    <button className="btn-descargar-cv"><i className="fas fa-download"></i> Descargar currículum</button>
                </div>

                {/* Resumen de Perfil */}
                <div className="curriculum">
                <h2>Resumen de Perfil</h2>
                    <h4>Curriculum</h4>
                    <ul>
                        <li onClick={() => handleNavigation("informacionGeneral")}><a>Información Géneral</a> {seccionesCompletas.informacionGeneral ? '✔' : '✖'}</li>
                        <li onClick={() => handleNavigation("presentacion")}><a>Presentación</a> {seccionesCompletas.presentacion ? '✔' : '✖'}</li>
                        <li onClick={() => handleNavigation("inclusionLaboral")}><a>Inclusión Laboral</a> {seccionesCompletas.inclusionLaboral ? '✔' : '✖'}</li>
                        <li onClick={() => handleNavigation("experienciaLaboral")}><a>Experiencia Laboral</a> {seccionesCompletas.experienciaLaboral ? '✔' : '✖'}</li>
                        <li onClick={() => handleNavigation("pretensiones")}><a>Pretensiones</a> {seccionesCompletas.pretensiones ? '✔' : '✖'}</li>
                        {/* Agrega más secciones según sea necesario */}
                    </ul>
                    <h4>Opcionales</h4>
                    <ul>
                        <li onClick={() => handleNavigation("formacion")}><a>Formación</a> {seccionesCompletas.formacion ? '✔'  : '✖'}</li>
                        <li onClick={() => handleNavigation("conocimientos")}><a>Conocimientos</a> {seccionesCompletas.conocimientos ? '✔' : '✖'}</li>
                    </ul>

                    <h4>Estoy interesado/a en</h4>
                    <ul>
                        <li>
                            <a>Proyectos medianos</a>
                            <span className="check-icon">✔</span>
                        </li>

                        <li>
                            <a>Proyectos pequeños</a>
                            <span className="check-icon">✔</span>
                        </li>
                        <li>
                            <a>Tareas</a>
                            <span className="check-icon">✔</span>
                        </li>
                    </ul>
                    <button className="btn-modificar-pref"><i className="fas fa-edit"></i> Modificar Preferencias</button>
                    <div></div>
                    <button className="btn-cambiar-cv"><i className="fas fa-edit"></i> Cambiar CV adjunto</button>
                    <div className="btn-container">
                        <button className="btn-ver-cv"><i className="fas fa-external-link"></i> Ver CV</button>
                        <button className="btn-borrar-cv"><i className="fas fa-trash"></i> Borrar CV</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilFreelancerCard;
