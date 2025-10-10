import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Clientes.module.css";
import API_URL from "../../../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Clientes({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    indicadoPor: "",
    obs: "",
  });
  const [modalEditar, setModalEditar] = useState(false);
  const [modalObs, setModalObs] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [editCliente, setEditCliente] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    indicado: "",
    obs: "",
  });

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
    const token = localStorage.getItem("token");
    if (token) {
      const carregarClientes = async () => {
        try {
          const res = await fetch(`${API_URL}/clientes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setClientes(data);
        } catch (err) {
          console.error(err);
        }
      };
      carregarClientes();
    }
  }, []);

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.id.toString().includes(searchTerm)
  );

  const carregarEstatisticasCliente = async (clienteId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/clientes/stats/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar estatísticas do cliente");

      const data = await res.json();
      setClienteSelecionado((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar estatísticas do cliente");
    }
  };

  const abrirModal = async (cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);

    await carregarEstatisticasCliente(cliente.id);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setClienteSelecionado(null);
  };

  const abrirModalNovoCliente = () => setModalNovoCliente(true);
  const fecharModalNovoCliente = () => {
    setModalNovoCliente(false);
    setNovoCliente({ nome: "", telefone: "", endereco: "", indicadoPor: "", obs: "" });
  };

  const salvarNovoCliente = async () => {
    if (!novoCliente.nome || !novoCliente.telefone || !novoCliente.endereco || !novoCliente.indicadoPor) {
      alert("⚠️ Preencha todos os campos antes de salvar!");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: novoCliente.nome,
          telefone: novoCliente.telefone,
          endereco: novoCliente.endereco,
          indicado: novoCliente.indicadoPor,
          obs: novoCliente.obs || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao cadastrar cliente");
        return;
      }

      setClientes((prev) => [...prev, data]);

      fecharModalNovoCliente();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar cliente");
    }
  };


  const formatarValor = (valor) => {
    if (valor === null || valor === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const abrirModalEditar = () => {
    setEditCliente({
      nome: clienteSelecionado.nome,
      telefone: clienteSelecionado.telefone,
      endereco: clienteSelecionado.endereco,
      indicado: clienteSelecionado.indicado,
      obs: clienteSelecionado.obs || "",
    });
    setModalEditar(true);
  };

  const salvarEdicao = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/clientes/${clienteSelecionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editCliente),
      });

      if (!res.ok) {
        alert("Erro ao editar cliente");
        return;
      }

      setClientes(
        clientes.map((c) => (c.id === clienteSelecionado.id ? { ...c, ...editCliente } : c))
      );

      setModalEditar(false);
      fecharModal();
    } catch (err) {
      console.error(err);
      alert("Erro ao editar cliente");
    }
  };

  const apagarCliente = async () => {
    if (window.confirm("Tem certeza que deseja apagar este cliente?")) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/clientes/${clienteSelecionado.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          alert("Erro ao apagar cliente");
          return;
        }
        setClientes(clientes.filter((c) => c.id !== clienteSelecionado.id));
        fecharModal();
      } catch (err) {
        console.error(err);
        alert("Erro ao apagar cliente");
      }
    }
  };

  const abrirModalObs = () => {
    setObservacao(clienteSelecionado?.obs || "");
    setModalObs(true);
  };
  const salvarObs = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/obs/${clienteSelecionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ obs: observacao }),
      });

      if (!res.ok) {
        alert("Erro ao atualizar observação");
        return;
      }

      setClienteSelecionado({ ...clienteSelecionado, obs: observacao });

      setClientes(
        clientes.map((c) =>
          c.id === clienteSelecionado.id ? { ...c, obs: observacao } : c
        )
      );

      setModalObs(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar observação");
    }
  };

  const gerarRelatorio = () => {
    if (!clienteSelecionado) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Relatório do Cliente - ${clienteSelecionado.nome}`, 14, 20);
    doc.setFontSize(12);
    doc.text("Dados Pessoais", 14, 30);
    autoTable(doc, {
      startY: 35,
      head: [["Campo", "Valor"]],
      body: [
        ["Nome", clienteSelecionado.nome],
        ["Telefone", clienteSelecionado.telefone || "-"],
        ["Endereço", clienteSelecionado.endereco || "-"],
        ["Indicado por", clienteSelecionado.indicado || "-"],
      ],
    });
    const posY = doc.lastAutoTable.finalY + 10;
    doc.text("Empréstimos", 14, posY);
    autoTable(doc, {
      startY: posY + 5,
      head: [["Campo", "Valor"]],
      body: [
        ["Total de Empréstimos", clienteSelecionado.total_emprestimos_feitos],
        ["Pendentes", clienteSelecionado.emprestimos_pendentes],
        ["Atrasados", clienteSelecionado.emprestimos_atrasados],
        ["Quitados", clienteSelecionado.emprestimos_pagos],
        ["Total Emprestado", formatarValor(clienteSelecionado.total_valor_emprestado)],
        ["Lucro Total", formatarValor(clienteSelecionado.lucro_total)],
        ["Maior Valor Emprestado", formatarValor(clienteSelecionado.maior_valor_emprestado)],
        ["Atrasos", clienteSelecionado.atrasos],
      ],
    });
    doc.save(`relatorio_${clienteSelecionado.nome}.pdf`);
  };

  const renderClientes = () => (
    <div className={styles.container}>
      <div className={styles.filtros}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou ID..."
          className={styles.inputBusca}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.botaoNovo} onClick={abrirModalNovoCliente}>
          + Novo Cliente
        </button>
      </div>
      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className={styles.tabelaRow}
                  onClick={() => abrirModal(cliente)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{cliente.id}</td>
                  <td className={styles.clienteClicavel}>👁️ {cliente.nome}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className={styles.notFound}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalAberto && clienteSelecionado && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={fecharModal}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>{clienteSelecionado.nome}</h2>
            <div className={styles.modalBody}>
              <div className={styles.card}>
                <h3>Dados Pessoais</h3>
                <p><strong>ID:</strong> {clienteSelecionado.id}</p>
                <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
                <p><strong>Telefone:</strong> {clienteSelecionado.telefone || "-"}</p>
                <p><strong>Endereço:</strong> {clienteSelecionado.endereco || "-"}</p>
                <p><strong>Indicado por:</strong> {clienteSelecionado.indicado || "-"}</p>
                <p><strong>Observações:</strong> {clienteSelecionado.obs || "-"}</p>
                <p>
                  <strong>Data Cadastro:</strong>{" "}
                  {new Date(clienteSelecionado.datacadastro).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className={styles.card}>
                <h3>Empréstimos</h3>
                <p><strong>Total de Empréstimos:</strong> {clienteSelecionado.total_emprestimos_feitos}</p>
                <p><strong>Pendentes:</strong> {clienteSelecionado.emprestimos_pendentes}</p>
                <p><strong>Atrasados:</strong> {clienteSelecionado.emprestimos_atrasados}</p>
                <p><strong>Quitados:</strong> {clienteSelecionado.emprestimos_pagos}</p>
                <p><strong>Total Emprestado:</strong> {formatarValor(clienteSelecionado.total_valor_emprestado)}</p>
                <p><strong>Lucro Total:</strong> {formatarValor(clienteSelecionado.lucro_total)}</p>
                <p><strong>Maior Valor Emprestado:</strong> {formatarValor(clienteSelecionado.maior_valor_emprestado)}</p>
                <p><strong>Atrasos:</strong> {clienteSelecionado.atrasos}</p>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.botaoEditar} onClick={abrirModalEditar}>
                ✏️ Editar
              </button>
              <button className={styles.botaoApagar} onClick={apagarCliente}>
                🗑️ Apagar
              </button>
              <button className={styles.botaoObs} onClick={abrirModalObs}>
                📝 Observação
              </button>
              <button className={styles.botaoRelatorio} onClick={gerarRelatorio}>
                📊 Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      )}
      {modalNovoCliente && (
        <div className={styles.modalOverlay} onClick={fecharModalNovoCliente}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={fecharModalNovoCliente}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>Adicionar Novo Cliente</h2>
            <div className={styles.modalBody}>
              <div className={styles.card}>
                <label>Nome</label>
                <input type="text" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} required />
                <label>Telefone</label>
                <input type="text" value={novoCliente.telefone} onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })} required />
                <label>Endereço</label>
                <input type="text" value={novoCliente.endereco} onChange={(e) => setNovoCliente({ ...novoCliente, endereco: e.target.value })} required />
                <label>Indicado por</label>
                <input type="text" value={novoCliente.indicadoPor} onChange={(e) => setNovoCliente({ ...novoCliente, indicadoPor: e.target.value })} required />
                <label>Observações</label>
                <textarea
                  className={styles.textareaObs}
                  value={novoCliente.obs}
                  onChange={(e) => setNovoCliente({ ...novoCliente, obs: e.target.value })}
                  placeholder="Escreva observações sobre este cliente..."
                />
              </div>
              <button className={styles.botaoSalvar} onClick={salvarNovoCliente}>
                Salvar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
      {modalEditar && (
        <div className={styles.modalOverlay} onClick={() => setModalEditar(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalEditar(false)}>&times;</button>
            <h2 className={styles.modalTitle}>Editar Cliente</h2>
            <div className={styles.card}>
              <input
                type="text"
                value={editCliente.nome}
                onChange={(e) => setEditCliente({ ...editCliente, nome: e.target.value })}
              />
              <input
                type="text"
                value={editCliente.telefone}
                onChange={(e) => setEditCliente({ ...editCliente, telefone: e.target.value })}
              />
              <input
                type="text"
                value={editCliente.endereco}
                onChange={(e) => setEditCliente({ ...editCliente, endereco: e.target.value })}
              />
              <input
                type="text"
                value={editCliente.indicado}
                onChange={(e) => setEditCliente({ ...editCliente, indicado: e.target.value })}
              />
              <textarea
                className={styles.textareaObs}
                value={editCliente.obs}
                onChange={(e) => setEditCliente({ ...editCliente, obs: e.target.value })}
                placeholder="Escreva observações sobre este cliente..."
              />
              <button className={styles.botaoSalvar} onClick={salvarEdicao}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
      {modalObs && (
        <div className={styles.modalOverlay} onClick={() => setModalObs(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalObs(false)}>&times;</button>
            <h2 className={styles.modalTitle}>Observação</h2>
            <textarea
              className={styles.textareaObs}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Escreva observações sobre este cliente..."
            />
            <button className={styles.botaoSalvar} onClick={salvarObs}>Salvar Observação</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMenu = () =>
    tipoUsuario === "admin" ? (
      <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>{renderClientes()}</MenuDonos>
    ) : tipoUsuario === "user" ? (
      <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>{renderClientes()}</MenuUsers>
    ) : (
      <p>Carregando...</p>
    );

  return <>{renderMenu()}</>;
}

export default Clientes;
