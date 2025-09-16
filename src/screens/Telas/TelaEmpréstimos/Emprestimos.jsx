import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Emprestimos.module.css";

function Emprestimos({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [emprestimos, setEmprestimos] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }

    const fakeData = [];
    for (let i = 1; i <= 50; i++) {
      fakeData.push({
        id: i,
        cliente: "Murillo Almeida Ludovico Inacio",
        valor: 1000 + i * 10,
        parcelas: 12,
        status: i % 2 === 0 ? "Pago" : "Pendente",
        data: `2025-07-${((i % 30) + 1).toString().padStart(2, "0")}`,
      });
    }
    setEmprestimos(fakeData);
  }, []);

  const filteredEmprestimos = emprestimos.filter(
    (e) =>
      e.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toString().includes(searchTerm)
  );

  const openModal = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  const renderModal = () => {
    if (!isModalOpen || !selectedLoan) return null;
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalCard}>
          <h2 className={styles.modalTitle}>Detalhes do Empréstimo</h2>
          <div className={styles.modalInfo}>
            <p><strong>ID Empréstimo:</strong> {selectedLoan.id}</p>
            <p><strong>Cliente:</strong> {selectedLoan.cliente}</p>
            <p><strong>Data:</strong> {selectedLoan.data}</p>
            <p><strong>Valor:</strong> R$ {selectedLoan.valor}</p>
            <p><strong>Parcelas:</strong> {selectedLoan.parcelas}</p>
            <p><strong>Status:</strong> {selectedLoan.status}</p>
          </div>
          <div className={styles.modalActions}>
            <button className={styles.btnFechar} onClick={closeModal}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEmprestimos = () => (
    <div className={styles.container}>
      <div className={styles.filtros}>
        <input
          type="text"
          placeholder="Pesquisar por cliente ou ID..."
          className={styles.inputBusca}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.botaoNovo}>+ Novo Empréstimo</button>
      </div>

      <p className={styles.avisocliente}>
        👆 Clique no Empréstimo para ver os detalhes.
      </p>

      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID Empréstimo</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmprestimos.length > 0 ? (
              filteredEmprestimos.map((e) => (
                <tr
                  className={styles.tabelaRow}
                  key={`${e.id}-${e.cliente}`}
                  onClick={() => openModal(e)}
                >
                  <td>{e.id}</td>
                  <td className={styles.clienteClicavel}>👁️ {e.cliente}</td>
                  <td>{e.data}</td>
                  <td>{e.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.notFound}>
                  Nenhum empréstimo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderModal()}
    </div>
  );

  const renderMenu =
    tipoUsuario === "admin" ? (
      <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
        {renderEmprestimos()}
      </MenuDonos>
    ) : tipoUsuario === "user" ? (
      <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
        {renderEmprestimos()}
      </MenuUsers>
    ) : (
      <p>Carregando...</p>
    );

  return <>{renderMenu}</>;
}

export default Emprestimos;
