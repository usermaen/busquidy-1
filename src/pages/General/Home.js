import React from "react"; //Importación de libreria
import Navbar from "../../components/Home/Navbar";
import CardSection from "../../components/Home/CardSection";
import Footer from "../../components/Home/Footer";

// Función que define el componente Home
function Home () { 
    return(
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <div className="main-content" style={{flex: 1}}>
                <Navbar/>
                <CardSection/>
                <Footer/>
            </div>
        </div>
    );
}

export default Home;