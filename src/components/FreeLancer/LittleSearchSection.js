import React from "react";
import { Link } from 'react-router-dom';
import "./LittleSearchSection.css"
import 'bootstrap-icons/font/bootstrap-icons.css';

function LittleSearchSection() {
    return (
        <div className="littlesearch-section">
            <h1>¡Busca proyectos que sean de tu interés!</h1>
            <p>Encuentra la mejor publicación que encaje contigo</p>
            <div className="littlesearch-bar">
                <div className="input-wrapper">
                    <i className="bi bi-briefcase"></i>
                    <input type="text" placeholder="Cargo o Categoría"></input>
                </div>
                <div className="input-wrapper">
                    <i className="bi bi-geo-alt"></i>
                    <input type="text" placeholder="Ubicación"></input>
                </div>
                {/* Usa Link en lugar de button */}
                <Link to="/projectlist" className="search-button">
                <button><i className="bi bi-search"></i>Buscar</button> 
                </Link>
            </div>
        </div>
    );
}

export default LittleSearchSection;
