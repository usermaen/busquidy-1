import React, { useState } from "react";
import "./PerfilEmpresaCard.css";

function PerfilEmpresaCard() {
    const [activeSection, setActiveSection] = useState('empresa-info');

    const renderSection = () => {
        switch (activeSection) {
            case 'empresa-info':
                return (
                    <div className="empresa-info-section">
                        <h2>Información de la Empresa</h2>
                        <div className="empresa-info">
                            <p><strong>Nombre de la Empresa:</strong> Ejemplo S.A.</p>
                            <p><strong>RUT:</strong> 12345678-9</p>
                            <p><strong>Dirección:</strong> Calle Falsa 123, Santiago, Chile</p>
                            <p><strong>Teléfono:</strong> +56 9 8765 4321</p>
                            <p><strong>Correo Electrónico:</strong> contacto@ejemplo.com</p>
                            <p><strong>Página Web:</strong> <a href="https://www.ejemplo.com" target="_blank" rel="noopener noreferrer">www.ejemplo.com</a></p>
                            <p><strong>Descripción:</strong> Somos una empresa dedicada a la innovación tecnológica con un enfoque en soluciones sostenibles.</p>
                            <p><strong>Sector/Industria:</strong> Tecnología</p>
                        </div>
                    </div>
                );
            case 'representante-info':
                return (
                    <div className="representante-info-section">
                        <h2>Información del Representante</h2>
                        <div className="representante-info">
                            <p><strong>Nombre Completo:</strong> Juan Pérez</p>
                            <p><strong>Cargo:</strong> Gerente General</p>
                            <p><strong>Correo Electrónico:</strong> juan.perez@ejemplo.com</p>
                            <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                        </div>
                    </div>
                );
            case 'empresa-access':
                return (
                    <div className="empresa-access-info-section">
                        <h2>Información de Acceso</h2>
                        <div className="access-info">
                            <p><strong>Nombre de Usuario:</strong> usuario_empresa</p>
                            <p><strong>Contraseña:</strong> ******</p>
                            <p><strong>Confirmación de Contraseña:</strong> ******</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="perfil-empresa-container">
            <div className="sidebar">
                <ul>
                    <li onClick={() => setActiveSection('empresa-info')} className={activeSection === 'empresa-info' ? 'active' : ''}>Información de la Empresa</li>
                    <li onClick={() => setActiveSection('representante-info')} className={activeSection === 'representante-info' ? 'active' : ''}>Información del Representante</li>
                    <li onClick={() => setActiveSection('empresa-access')} className={activeSection === 'empresa-access' ? 'active' : ''}>Información de Acceso</li>
                </ul>
            </div>
            <div className="content">
                {renderSection()}
            </div>
        </div>
    );
}

export default PerfilEmpresaCard;
