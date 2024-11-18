import React from "react";
import "./UserTable.css";

function UserTable() {
    return (
        <div className="user-management">
        <h1>Gestión de Usuarios</h1>
        <div className="user-table-container">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Aquí irán las filas de usuarios */}
                    <tr>
                        <td>1</td>
                        <td>Juan Pérez</td>
                        <td>juan.perez@email.com</td>
                        <td>Freelancer</td>
                        <td>
                            <button className="edit-btn">Editar</button>
                            <button className="delete-btn">Eliminar</button>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Empresa XYZ</td>
                        <td>empresa@xyz.com</td>
                        <td>Empresa</td>
                        <td>
                            <button className="edit-btn">Editar</button>
                            <button className="delete-btn">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default UserTable;