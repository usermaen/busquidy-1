import React, { useState } from "react";
import "./SearchFilters.css";

function SearchFilters() {
    const [location, setLocation] = useState("");
    const [rating, setRating] = useState("");
    const [skills, setSkills] = useState("");
    const [search, setSearch] = useState("");

    const handleFilter = () => {
        // Aquí puedes manejar la lógica de los filtros (llamar a un API, filtrar localmente, etc.)
        console.log({ location, rating, skills });
    };

    return (
        <div className="custom-filters-container">
            <h2>Filtrar Freelancers</h2>
            <div className="custom-filter-group">
                <label htmlFor="search">Buscar por nombre</label>
                <input
                    type="text"
                    id="search"
                    placeholder="Ej. Ricardo"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}>
                </input>
            </div>

            <div className="custom-filter-group">
                <label htmlFor="location">Ubicación</label>
                <input
                    type="text"
                    id="location"
                    placeholder="Ej. Santiago"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            <div className="custom-filter-group">
                <label htmlFor="rating">Calificación</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                >
                    <option value="">Todas</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                </select>
            </div>

            <div className="custom-filter-group">
                <label htmlFor="skills">Habilidades</label>
                <input
                    type="text"
                    id="skills"
                    placeholder="Ej. React, Node.js"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                />
            </div>

            <button onClick={handleFilter} className="custom-apply-filters-btn">Aplicar Filtros</button>
        </div>
    );
}

export default SearchFilters;
