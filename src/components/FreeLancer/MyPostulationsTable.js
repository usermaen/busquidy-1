import React, { useState } from 'react';
import './MyPostulationsTable.css';

const MyPostulationsTable = () => {
    const postulations = [
        {
            id: 1,
            imageUrl: "https://via.placeholder.com/50",
            title: "Práctica Profesional Ingeniería en Computación / Informática",
            company: "WOM",
            date: "2024-10-23",
            status: "Postulado",
        },
        {
            id: 2,
            imageUrl: "https://via.placeholder.com/50",
            title: "Desarrollador Full Stack",
            company: "Acme Corp",
            date: "2024-10-20",
            status: "Revisado",
        },
        {
            id: 3,
            imageUrl: "https://via.placeholder.com/50",
            title: "Ingeniero de Datos",
            company: "Tech Solutions",
            date: "2024-10-18",
            status: "En Proceso",
        },
        {
            id: 4,
            imageUrl: "https://via.placeholder.com/50",
            title: "Analista de Sistemas",
            company: "Globex Inc",
            date: "2024-10-10",
            status: "Postulado",
        },
        {
            id: 5,
            imageUrl: "https://via.placeholder.com/50",
            title: "Gestor de Proyectos",
            company: "Soysa",
            date: "2024-09-30",
            status: "Finalizado",
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("Estado");

    const itemsPerPage = 4;
    const totalPages = Math.ceil(postulations.length / itemsPerPage);

    // Función para calcular el tiempo transcurrido desde la fecha de postulación
    const calculateTimeAgo = (postDate) => {
        const postDateObj = new Date(postDate);
        const now = new Date();
        const differenceInMs = now - postDateObj;
        const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

        if (daysAgo < 1) return "Hoy";
        if (daysAgo === 1) return "Hace 1 día";
        if (daysAgo < 7) return `Hace ${daysAgo} días`;
        if (daysAgo < 30) return `Hace ${Math.floor(daysAgo / 7)} semanas`;
        return `Hace ${Math.floor(daysAgo / 30)} meses`;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const currentPostulations = postulations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className='background-postulations'>
            <div className="postulaciones-container">
                <div className="header">
                    <div className="title-box">
                        <h3>Mis Postulaciones</h3>
                    </div>
                    <div className="sort-pagination-box">
                        <div className="sort">
                            <label htmlFor="sort">Ordenar por:</label>
                            <select id="sort" value={sortOption} onChange={handleSortChange}>
                                <option value="Estado">Estado</option>
                                <option value="Fecha">Fecha</option>
                                <option value="Empresa">Empresa</option>
                            </select>
                        </div>
                        <div className="pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                &lt;
                            </button>
                            <span>{currentPage} de {totalPages}</span>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
                <div className="tabla-postulaciones">
                    {currentPostulations.map((postulation) => (
                        <div key={postulation.id} className="postulacion-item">
                            <div className="postulacion-info">
                                <img src={postulation.imageUrl} alt="Logo Empresa" />
                                <div>
                                    <p className="titulo">{postulation.title}</p>
                                    <p className="empresa">{postulation.company}</p>
                                </div>
                            </div>
                            <div className="fecha">
                                <p className="tiempo-transcurrido">{calculateTimeAgo(postulation.date)}</p>
                                <p className="fecha-original">{postulation.date}</p>
                            </div>
                            <p className="estado" title='Estado de postulación'>{postulation.status}</p>
                            <div className="acciones">
                                <span className="ver" title='Ver publicación'>
                                    <i className="fas fa-eye"></i>
                                </span>
                                <span className="eliminar" title='Eliminar postulación'>
                                    <i className="fas fa-trash-alt"></i>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPostulationsTable;
