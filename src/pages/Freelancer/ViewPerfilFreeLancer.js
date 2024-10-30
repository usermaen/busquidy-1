import React from "react";
import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import Footer from "../../components/Home/Footer";
import PerfilFreelancerCard from "../../components/FreeLancer/PerfilFreelancerCard";

function ViewPerfilFreeLancer() {
    return (
        <div>
            <NavbarFreeLancer />
            <PerfilFreelancerCard /> 
            <Footer />
        </div>
    );
};

export default ViewPerfilFreeLancer;