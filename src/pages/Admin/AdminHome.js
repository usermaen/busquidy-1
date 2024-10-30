import React from "react";
import ModuleAdmin from "../../components/Admin/ModuleAdmin";
import Dashboard from "../../components/Admin/Dashboard";

function AdminHome(){
    return(
        <div className="admin-login">
            <Dashboard />
            <ModuleAdmin />
        </div>
    )
}

export default AdminHome;