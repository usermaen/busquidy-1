import React from "react";
import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
import Footer from "../../components/Home/Footer";
import PerfilEmpresaCard from "../../components/Empresa/PerfilEmpresaCard";


function ViewPerfilEmpresa() {
    return (
        <div>
            <NavbarEmpresa />
            <PerfilEmpresaCard />
            <Footer />
        </div>
    );
};

export default ViewPerfilEmpresa;