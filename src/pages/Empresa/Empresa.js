import React from "react";
import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa"
import Footer from "../../components/Home/Footer";
import EmpresaActionsCard from "../../components/Empresa/EmpresaActionsCard";

function Empresa () {
    return (
        <div>
            <NavbarEmpresa/>
            <EmpresaActionsCard/>
            <Footer/>
        </div>
    );
}


export default Empresa;