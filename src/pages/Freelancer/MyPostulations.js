import React from "react";
import NavbarFreeLancer from "../../components/FreeLancer/NavbarFreeLancer";
import MyPostulationsTable from "../../components/FreeLancer/MyPostulationsTable";
import Footer from "../../components/Home/Footer";

function MyPostulations() {
    return  (
        <div>
            <NavbarFreeLancer />
            <MyPostulationsTable />
            <Footer />
        </div>
    );
}

export default MyPostulations;