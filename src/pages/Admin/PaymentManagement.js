import React from "react";
import PaymentTable from "../../components/Admin/PaymentTable"; // Componente de la tabla de pagos

function PaymentManagement() {
    return (
        <div className="payment-management">
            <h1>Gestión de Pagos y Transacciones</h1>
            <PaymentTable />
        </div>
    );
}

export default PaymentManagement;
