import React, { useState } from "react";
import Select from "react-select"; // Import React-Select
import "./SearchPublicationSection.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

function SearchPublicationSection() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const carreraOptions = [
    { value: "todos", label: "Todas" },
    { value: "informatica", label: "Informática" },
    { value: "diseno", label: "Diseño" }
  ];

  const regionOptions = [
    { value: "todos", label: "Todas" },
    { value: "norte", label: "Norte" },
    { value: "sur", label: "Sur" }
  ];

  const comunaOptions = [
    { value: "todos", label: "Todas" },
    { value: "comuna1", label: "Comuna 1" },
    { value: "comuna2", label: "Comuna 2" },
    { value: "comuna3", label: "Comuna 3" }
  ];

  const jornadaOptions = [
    { value: "todos", label: "Todas" },
    { value: "completa", label: "Completa" },
    { value: "parcial", label: "Parcial" }
  ];

  const areaTrabajoOptions = [
    { value: "todos", label: "Todas" },
    { value: "informatica", label: "Informática" },
    { value: "diseno", label: "Diseño" }
  ];

  const toggleFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  return (
    <div className="search-section">
      <div className="search-bar-container">
        <input type="text" className="search-bar" placeholder="Buscar por nombre..." />
        <div className="filter-item-main">
          <select className="filter-main-button">
            <option value="proyecto">Proyecto</option>
            <option value="mediano">Mediano</option>
            <option value="pequeno">Pequeño</option>
            <option value="micro">Micro</option>
          </select>
        </div>
        <button className="search-button"><i className="bi bi-search"></i>Buscar</button>
      </div>

      {/* Filtros principales */}
      <div className="main-filters">
        <div className="filter-item-main">
          <select className="filter-main-button">
            <option value="ordenar-por">Ordenar por</option>
            <option value="relevancia">Relevancia</option>
            <option value="fecha">Fecha</option>
            <option value="salario">Salario</option>
          </select>
        </div>

        <div className="filter-item-main">
          <select className="filter-main-button">
            <option value="fecha">Fecha</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>
        </div>

        <div className="filter-item-main">
          <select className="filter-main-button">
            <option value="modalidad">Modalidad</option>
            <option value="remoto">Remoto</option>
            <option value="presencial">Presencial</option>
          </select>
        </div>

        <div className="filter-item-main">
          <select className="filter-main-button">
            <option value="discapacidad">Discapacidad</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="filter-item-main">
          <select className="filter-main-button">
            <option value="discapacidad">Experiencia</option>
            <option value="sin-experiencia">Sin experiencia</option>
            <option value="1ano">1 año</option>
            <option value="2ano">2 años</option>
            <option value="3-4ano">3-4 años</option>
            <option value="5-10ano">5-10 años</option>
            <option value="mas10anos">Más de 10 años</option>
          </select>
        </div>
      </div>


      {/* Botón de Mostrar más filtros */}
      <div className="toggle-filters-container">
        <button className="toggle-filters" onClick={toggleFilters}>
          <i className="bi bi-filter"></i>{showMoreFilters ? " Ocultar filtros" : " Mostrar más filtros"}
        </button>
      </div>
      
      {/* Filtros adicionales */}
      <div className={`filters-container ${showMoreFilters ? 'show' : ''}`}>
        <div className="filter-grid">
          {/* Fila 1 */}
          <div className="filter-item">
            <label>Carrera</label>
            <Select options={carreraOptions} placeholder="Todas" className="filter-dropdown" isSearchable={true} />
          </div>
          <div className="filter-item">
            <label>Región</label>
            <Select options={regionOptions} placeholder="Todas" className="filter-dropdown" isSearchable={true} />
          </div>
          <div className="filter-item">
            <label>Comuna</label>
            <Select options={comunaOptions} placeholder="Todas" className="filter-dropdown" isSearchable={true} />
          </div>
          <div className="filter-item">
            <label>Jornada</label>
            <Select options={jornadaOptions} placeholder="Todas" className="filter-dropdown" isSearchable={true} />
          </div>
          <div className="filter-item">
            <label>Área de trabajo</label>
            <Select options={areaTrabajoOptions} placeholder="Todas" className="filter-dropdown" isSearchable={true} />
          </div>

          {/* Fila 2*/}
          <div className="filter-buttons">
            <button className="apply-filters"><i className="bi bi-arrow-up"></i>Aplicar filtros</button>
            <button className="clear-filters"><i className="bi bi-eraser"></i>Limpiar filtros</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPublicationSection;