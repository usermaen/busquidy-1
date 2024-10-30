import React from "react";
import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import SearchPublicationSection from "../../components/FreeLancer/SearchPublicationSection";
import PublicationList from "../../components/FreeLancer/PublicationList";
import Footer from "../../components/Home/Footer";

function ProjectList() {
    return  (
        <div>
            <NavbarFreeLancer />
            <SearchPublicationSection />
            <PublicationList />
            <Footer />
        </div>
    );
}

export default ProjectList;