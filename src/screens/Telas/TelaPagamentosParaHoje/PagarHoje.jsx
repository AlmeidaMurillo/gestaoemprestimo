import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./PagarHoje.module.css";
import { useNavigate } from "react-router-dom";

function PagarHoje({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [parcelas, setParcelas] = useState([
    {
      numeroParcela: 1,
      totalParcelas: 2,
      idEmprestimo: 1,
      cliente: "BRUNETE",
      dataVencimento: "24/06/2025",
      valor: 390.0,
      status: "Pendente",
    },
  ]);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
  }, []);

  const alternarStatus = (index) => {
    const novas = [...parcelas];
    novas[index].status = novas[index].status === "Pago" ? "Pendente" : "Pago";
    setParcelas(novas);
  };

  const filtered = parcelas.filter((p) =>
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderParcelas = () => (
    <div className={`${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.parcelasBox}>
        {filtered.map((p, i) => (
          <div key={i} className={styles.parcelaCard}>
            <p><strong>Cliente:</strong> {p.cliente}</p>
            <p><strong>Parcela:</strong> {p.numeroParcela}/{p.totalParcelas}</p>
            <p><strong>ID Empréstimo:</strong> {p.idEmprestimo}</p>
            <p><strong>Data Vencimento:</strong> {p.dataVencimento}</p>
            <p><strong>Valor:</strong> R$ {p.valor.toFixed(2)}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={p.status === "Pago" ? styles.statusPago : styles.statusPendente}>
                {p.status}
              </span>
            </p>
            <button className={styles.botaoStatus} onClick={() => alternarStatus(i)}>
              {p.status === "Pago" ? "Marcar como Pendente" : "Marcar como Pago"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className={styles.notFound}>Nenhuma parcela encontrada.</p>
        )}
      </div>
    </div>
  );

  const renderMenu = () => {
    if (tipoUsuario === "admin") {
      return (
        <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          {renderParcelas()}
        </MenuDonos>
      );
    } else if (tipoUsuario === "user") {
      return (
        <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          {renderParcelas()}
        </MenuUsers>
      );
    } else {
      return <p>Carregando...</p>;
    }
  };

  return <>{renderMenu()}</>;
}

export default PagarHoje