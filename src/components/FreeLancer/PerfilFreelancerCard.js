import React from "react";
import "./PerfilFreelancerCard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function PerfilFreelacerCard() {
    return (
        <div className="perfil-free-container">
            
            {/* Lado izquierdo */}
            <div className="perfil-info">
                <h2 id="informacion-general">Información General</h2>

                {/* Información general */}
                <div className="mini-card">
                    <div className="info-detalles">
                        <p><strong>Nombre completo:</strong> John Doe</p>
                        <p><strong>Correo electrónico:</strong> john.doe@example.com</p>
                        <p><strong>Fecha de nacimiento:</strong> 1 de Ene, 1990</p>
                        <p><strong>Ubicación:</strong> Santiago, Chile</p>
                        <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                    </div>
                    <button className="btn-editar"><i className="fas fa-edit"></i>Editar</button>
                </div>

                {/* Presentación */}
                <h2 id="presentacion">Presentación</h2>
                <div className="mini-card">
                    <p>Desarrollador Full Stack con experiencia en React y Node.js. Apasionado por la tecnología y en constante aprendizaje.</p>
                    <button className="btn-editar"><i className="fas fa-edit"></i>Editar</button>
                </div>

                {/* Inclusión Laboral */}
                <h2 id="inclusion-laboral">Inclusión Laboral</h2>
                <div className="mini-card">
                    <p>¿Tienes alguna discapacidad? No</p>
                    <button className="btn-editar"><i className="fas fa-edit"></i>Editar</button>
                </div>

                {/* Experiencia Laboral */}
                <h2 id="experiencia-laboral">Experiencia Laboral</h2>
                <div className="exp-laboral">

                    {/* Años de experiencia */}
                    <div className="mini-card">
                        <h3>Años de experiencia</h3>
                        <p style={{textAlign:"center"}}><b>1 año</b></p>
                        <button className="btn-editar"><i className="fas fa-edit"></i>Editar</button>
                    </div>

                    {/* Emprendimientos */}
                    <div className="mini-card">
                        <h3>Emprendimiento</h3>
                        <p>¿Estás emprendiendo? No</p>
                        <button className="btn-editar"><i className="fas fa-edit"></i>Editar</button>
                    </div>

                    {/* Trabajos y Prácticas */}
                    <div className="mini-card">
                        <h3>Prácticas y Trabajos</h3>
                        <p>1 Practica en la chile</p>
                    </div>

                    {/* Mini seccion agregar */}
                    <div className="mini-card-agregar">
                        <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar Práctica o Trabajo</button>
                    </div>
                </div>

                {/* Formación */}
                <h2>Formación</h2>
                <div className="formacion">
                    <div className="mini-card">
                        <h3>Nivel Educacional</h3>
                        <p>Universitaria (Incompleta)</p>
                        <button className="btn-editar"><i className="fas fa-edit"></i>Editar</button>
                    </div>

                    {/* Educación superior */}
                    <div className="mini-card">
                        <h3 id="educacion-superior">Educación Superior</h3>
                        <p>Técnico de Nivel Superior Analista Programador - INACAP, Chile</p>
                    </div>

                    {/* Mini seccion agregar */}
                    <div className="mini-card-agregar">
                    </div>

                    {/* Mini seccion agregar */}
                    <div className="mini-card-agregar">
                        <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar educación superior</button>
                    </div>

                    {/* Educación básica y media */}
                    <div className="mini-card">
                        <h3 id="educacion-media">Educación Media</h3>
                        <p>Colegio Adventista Santiago Poniente</p>
                    </div>

                    {/* Mini seccion agregar */}
                    <div className="mini-card-agregar">
                        <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar educación media</button>
                    </div>

                    {/* Posgrados */}
                    <div className="mini-card">
                        <h3 id="posgrados">Posgrados</h3>
                        <p></p>
                    </div>

                    {/* Mini seccion agregar */}
                    <div className="mini-card-agregar">
                        <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar posgrado</button>
                    </div>

                    {/* Información adicional */}
                    <div className="mini-card">
                        <h3 id="informacion-adicional">Información Adicional</h3>
                        <p></p>
                    </div>

                    {/* Mini seccion agregar */}
                    <div className="mini-card-agregar">
                        <button className="btn-agregar"><i className="fas fa-plus"></i>Agregar información adicional</button>
                    </div>
                </div>

                {/* Conocimientos */}
                <div className="conocimientos">
                    <h2>Conocimientos</h2>

                    {/* Idiomas */}
                    <div className="mini-card">
                        <h3 id="idiomas">Idiomas</h3>
                        <div>
                            <div className="conocimiento-item">
                                <span>Inglés (Intermedio)</span>
                                <button className="btn-eliminar">✖</button>
                            </div>
                        </div>
                        <button className="btn-agregar-conocimiento">
                            <i className="fas fa-plus"></i>Agregar
                        </button>
                    </div>

                    {/* Habilidades */}
                    <div className="mini-card">
                        <h3 id="habilidades">Habilidades</h3>
                        <div>
                            <div className="conocimiento-item">
                                <span>Java (Básico)</span>
                                <button className="btn-eliminar">✖</button>
                            </div>
                            <div className="conocimiento-item">
                                <span>Python (Intermedio)</span>
                                <button className="btn-eliminar">✖</button>
                            </div>
                            <div className="conocimiento-item">
                                <span>MySQL (Intermedio)</span>
                                <button className="btn-eliminar">✖</button>
                            </div>
                            <div className="conocimiento-item">
                                <span>JavaScript (Intermedio)</span>
                                <button className="btn-eliminar">✖</button>
                            </div>
                        </div>
                        <button className="btn-agregar-conocimiento">
                            <i className="fas fa-plus"></i>Agregar
                        </button>
                    </div>
                </div>
            </div>

            {/* Lado derecho */}
            <div className="perfil-sidebar">

                {/* Seccion de foto perfil */}
                <h2 style={{textAlign:"center"}}>Foto de Perfil</h2>
                <div className="foto-perfil">
                    <img src="https://via.placeholder.com/150" alt="Foto de perfil" />
                    <button className="btn-cambiar-foto"><i className="fas fa-edit"></i> Cambiar Foto</button>
                </div>

                {/* Barra de progreso */}
                <div className="completitud">
                    <p>85%</p>
                    <div className="barra-progreso">
                        <div className="progreso" style={{ width: "85%" }}></div>
                    </div>
                    <p className="completitud-mensaje">Este porcentaje de completitud es solo una referencia y no tiene relación con lo adecuado de tu perfil. Te recomendamos completarlo lo mejor posible.</p>
                    <button className="btn-descargar-cv"><i className="fas fa-download"></i> Descargar currículum</button>
                </div>

                {/* Currículum y Opcionales */}
                <div className="curriculum">
                    <h2>Currículum</h2>
                    <ul>
                        <li>
                            <a href="#informacion-general">Información general</a> 
                            <span className="check-icon">✔</span>
                        </li>
                        <li>
                            <a href="#presentacion">Presentación</a> 
                            <span className="check-icon">✔</span>
                        </li>
                        <li>
                            <a href="#inclusion-laboral">Inclusión laboral</a> 
                            <span className="check-icon">✔</span>
                        </li>
                        <li>
                            <a href="#experiencia-laboral">Experiencia laboral</a> 
                            <span className="x-icon">✖</span>
                        </li>
                        <li>
                            <a href="#educacion-superior">Educación superior</a> 
                            <span className="check-icon">✔</span>
                        </li>
                        <li>
                            <a href="#posgrados">Posgrados</a> 
                            <span className="x-icon">✖</span>
                        </li>
                        <li>
                            <a href="idiomas">Idiomas</a> 
                            <span className="check-icon">✔</span>
                        </li>
                        <li>
                            <a href="#habilidades">Habilidades</a> 
                            <span className="check-icon">✔</span>
                        </li>
                    </ul>

                    <h2>Opcionales</h2>
                    <ul>
                        <li>
                            <a href="#educacion-media">Educación media</a> 
                            <span className="check-icon">✔</span>
                        </li>
                        <li>
                            <a href="#informacion-adicional">Información adicional</a> 
                            <span className="x-icon">✖</span>
                        </li>
                    </ul>

                    <h2>Estoy interesado/a en</h2>
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
                </div>
            </div>
        </div>
    );
}

export default PerfilFreelacerCard;
