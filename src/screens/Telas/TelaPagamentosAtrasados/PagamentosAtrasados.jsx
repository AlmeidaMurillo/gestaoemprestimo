import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./PagamentosAtrasados.module.css";
import { useNavigate } from "react-router-dom";

function PagamentosAtrasados({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [parcelas, setParcelas] = useState([
    {
      numeroParcela: 2,
      totalParcelas: 4,
      idEmprestimo: 3,
      cliente: "ALMEIDA",
      dataVencimento: "10/05/2025",
      valor: 600.0,
      status: "Em Atraso",
    },
    {
      numeroParcela: 3,
      totalParcelas: 4,
      idEmprestimo: 3,
      cliente: "ALMEIDA",
      dataVencimento: "10/06/2025",
      valor: 600.0,
      status: "Em Atraso",
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

  const marcarComoPago = (index) => {
    const novas = [...parcelas];
    novas[index].status = "Pago";
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
              <span className={styles.statusAtrasada}>
                {p.status}
              </span>
            </p>
            <button className={styles.botaoStatus} onClick={() => marcarComoPago(i)}>
              Marcar como Pago
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

export default PagamentosAtrasados;
