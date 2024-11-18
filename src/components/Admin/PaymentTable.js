import React from "react";
import './PaymentTable.css'; // CSS para la tabla

const paymentTransactions = [
    // Ejemplo de datos de transacciones
    { id: 1, freelancer: "Freelancer A", company: "Empresa B", amount: "$100", status: "Completado" },
    { id: 2, freelancer: "Freelancer C", company: "Empresa D", amount: "$200", status: "Pendiente" },
    { id: 3, freelancer: "Freelancer E", company: "Empresa F", amount: "$150", status: "Reembolsado" },
];

function PaymentTable() {
    return (
        <table className="payment-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Freelancer</th>
                    <th>Empresa</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {paymentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{transaction.freelancer}</td>
                        <td>{transaction.company}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.status}</td>
                        <td>
                            <button className="refund-btn">Reembolsar</button>
                            <button className="dispute-btn">Resolver Disputa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PaymentTable;
