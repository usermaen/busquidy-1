import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/General/Home";
import AdminHome from "./pages/Admin/AdminHome";
import LoginAdmin from "./pages/Admin/LoginAdmin";
import FreeLancer from "./pages/Freelancer/FreeLancer";
import Empresa from "./pages/Empresa/Empresa";
import ProjectList from "./pages/Freelancer/ProjectList";
import ViewPerfilFreeLancer from "./pages/Freelancer/ViewPerfilFreeLancer";
import ViewPerfilEmpresa from "./pages/Empresa/ViewPerfilEmpresa";
import FindFreelancer from "./pages/Empresa/FindFreelancer";
import MyProjects from "./pages/Empresa/MyProjects";
import UserManagement from "./pages/Admin/UserManagement";
import ProjectManagement from "./pages/Admin/ProjectManagement";
import ReviewManagement from "./pages/Admin/ReviewManagement";
import SupportManagement from "./pages/Admin/SuportManagement";
import PaymentManagement from "./pages/Admin/PaymentManagement";
import NotificationManegement from "./pages/Admin/NotificationManagement";
import AuditAndSecurity from "./pages/Admin/AuditAndSecurity";
import MyPostulations from "./pages/Freelancer/MyPostulations";
import CreateCV from "./components/FreeLancer/CreateCv";
import "./App.css";
import ViewCV from "./pages/Freelancer/ViewCV";

function App() {
  return (
    <Router>
      <div id="root">

        {/* Contenido principal */}
        <div className="main-content">
          <Routes>
            <Route path= "/" element={<Home />} />
            <Route path= "/loginadmin" element={<LoginAdmin />} />
            <Route path= "/adminhome" element={<AdminHome />} />
            <Route path= "/freelancer" element={<FreeLancer />} />
            <Route path= "/empresa" element={<Empresa />} />
            <Route path= "/projectlist" element={<ProjectList />} />
            <Route path= "/viewperfilfreelancer" element={<ViewPerfilFreeLancer />} />
            <Route path= "/viewperfilempresa" element={<ViewPerfilEmpresa />} />
            <Route path= "/findfreelancer" element={<FindFreelancer />} />
            <Route path= "/myprojects" element={<MyProjects />} />
            <Route path= "/usermanagement" element={<UserManagement />} />
            <Route path= "/projectmanagement" element={<ProjectManagement />} />
            <Route path= "/reviewmanagement" element={<ReviewManagement />} />
            <Route path= "/supportmanagement" element={<SupportManagement />} />
            <Route path= "/paymentmanagement" element={<PaymentManagement />} />
            <Route path= "/notificationmanagement" element={<NotificationManegement />} />
            <Route path= "/auditandsecurity" element={<AuditAndSecurity />} />
            <Route path= "/mypostulations" element={<MyPostulations />} />
            <Route path= "/viewcv" element={<ViewCV />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
