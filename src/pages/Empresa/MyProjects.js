import React from "react";
import NavbarEmpresa from "../../components/Empresa/NavbarEmpresa";
import CreateProject from "../../components/Empresa/CreateProject";
import ViewProjects from "../../components/Empresa/ViewProjects";
import Footer from "../../components/Home/Footer";
import "./MyProjects.css"

function MyProjects() {
    return (
        <div>
            <NavbarEmpresa/>
            <div className="background-color-myproject">
                <ViewProjects/>
                <CreateProject/>
                <Footer/>
            </div>
        </div>
    );
};

export default MyProjects;