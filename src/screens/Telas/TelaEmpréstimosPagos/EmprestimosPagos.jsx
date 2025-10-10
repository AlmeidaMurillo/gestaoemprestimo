import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./EmprestimosPagos.module.css";
import API_URL from "../../../api";

function EmprestimosPagos({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [emprestimos, setEmprestimos] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalSearchData, setModalSearchData] = useState("");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }

    const token = localStorage.getItem("token");
    if (token) {
      const carregarDados = async () => {
        try {
          const res = await fetch(`${API_URL}/emprestimos/pagos`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const dados = await res.json();
          setEmprestimos(dados);
        } catch (err) {
          console.error(err);
        }
      };
      carregarDados();
    }
  }, []);

  const filteredEmprestimos = emprestimos.filter(
    (e) =>
      e.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toString().includes(searchTerm)
  );



  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const limpar = () => {
    setSearchTerm("");
    setModalSearchTerm("");
    setModalSearchData("");
  };

  const clientLoans = selectedClient
    ? emprestimos.filter((e) => e.cliente === selectedClient.cliente)
    : [];

  const filteredClientLoans = clientLoans.filter((e) => {
    const idMatch =
      !modalSearchTerm || e.id.toString().includes(modalSearchTerm);
    const dataMatch = !modalSearchData || e.data.includes(modalSearchData);
    return idMatch && dataMatch;
  });

  const formatarData = (dataString) => {
    if (!dataString) return ""
    const data = new Date(dataString)
    const dia = String(data.getDate()).padStart(2, "0")
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const ano = data.getFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const renderModal = () => {
    if (!isModalOpen || !selectedClient) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalCard}>
          <h2 className={styles.modalTitle}>Empréstimos</h2>

          <div className={styles.modalInfo}>
            <p>
              <strong>ID Cliente:</strong>{" "}
              <span className={styles.clientId}>{selectedClient.id}</span>
            </p>
            <p>
              <strong>Nome:</strong>{" "}
              <span className={styles.clientName}>
                {selectedClient.cliente}
              </span>
            </p>
            <p>
              <strong>Total de Empréstimos:</strong>{" "}
              <span className={styles.loanCount}>{clientLoans.length}</span>
            </p>
          </div>

          <div className={styles.modalSearchWrapperDouble}>
            <input
              type="text"
              placeholder="Buscar por ID..."
              value={modalSearchTerm}
              onChange={(e) => setModalSearchTerm(e.target.value)}
              className={styles.modalSearchInputId}
            />
            <input
              type="date"
              value={modalSearchData}
              onChange={(e) => setModalSearchData(e.target.value)}
              className={styles.modalSearchInputDate}
            />
          </div>

          <div className={styles.scrollTable}>
            <table className={styles.modalTabela}>
              <thead>
                <tr>
                  <th>ID Empréstimo</th>
                  <th>Data Empréstimo</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientLoans.length > 0 ? (
                  filteredClientLoans.map((e) => (
                    <tr key={`${e.id}-${e.data}`}>
                      <td>{e.id}</td>
                      <td>{e.data}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className={styles.notFound}>
                      Nenhum empréstimo encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.modalActions}>
            <button className={styles.btnLimpar} onClick={limpar}>
              Limpar
            </button>
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
      </div>

      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID Empréstimo</th>
              <th>Cliente</th>
              <th>Data Empréstimo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmprestimos.length > 0 ? (
              filteredEmprestimos.map((e) => (
                <tr key={`${e.id}-${e.cliente}`} className={styles.tabelaRow}>
                  <td>{e.id}</td>
                  <td className={styles.clienteClicavel}>👁️ {e.cliente}</td>
                  <td>{formatarData(e.dataemprestimo)}</td>
                  <td>{e.statos}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.notFound}>Nenhum empréstimo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {renderModal()}
    </div>
  );

  const renderMenu = () =>
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

  return <>{renderMenu()}</>;
}

export default EmprestimosPagos;
