import React from "react";
import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
import SearchFilters from "../../components/Empresa/SearchFilters"; // Importa el nuevo componente
import FreelancerList from "../../components/Empresa/FreelancerList";
import Footer from "../../components/Home/Footer";
import "./FindFreelancer.css"; // Archivo de estilos para la disposición

function FindFreelancer() {
    return (
        <div>
            <NavbarEmpresa />
            <div className="background-color">

                <div className="custom-findfreelancer-container">
                    <SearchFilters /> {/* Filtros a la izquierda */}
                    <FreelancerList /> {/* Lista de freelancers a la derecha */}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default FindFreelancer;
