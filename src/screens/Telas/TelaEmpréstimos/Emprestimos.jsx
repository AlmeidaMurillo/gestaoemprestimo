import React, { useEffect, useState } from "react"
import MenuDonos from "../../../components/MenuDonos/MenuDonos"
import MenuUsers from "../../../components/MenuUsers/MenuUsers"
import styles from "./Emprestimos.module.css"
import API_URL from "../../../api"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Emprestimos({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emprestimos, setEmprestimos] = useState([])
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [clientesCadastrados, setClientesCadastrados] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [isNovoEmprestimoOpen, setIsNovoEmprestimoOpen] = useState(false)
  const [isEditarEmprestimoOpen, setIsEditarEmprestimoOpen] = useState(false);
  const [emprestimoEditando, setEmprestimoEditando] = useState(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [novoEmprestimo, setNovoEmprestimo] = useState({
    cliente: "",
    valorEmprestado: "",
    valorPagar: "",
    parcelas: "",
    data: "",
    obs: "",
  })

  const gerarRelatorioPDF = (loan) => {
    const doc = new jsPDF();
    const margemEsquerda = 20;

    doc.setFontSize(18);
    doc.text("Relatório Completo de Empréstimo", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Cod. Empréstimo: ${loan.id ?? "-"}`, margemEsquerda, 35);
    doc.text(`Cod. Cliente: ${loan.id_cliente ?? "-"}`, margemEsquerda, 42);
    doc.text(`Cliente: ${loan.cliente ?? "-"}`, margemEsquerda, 49);
    doc.text(`Data do Empréstimo: ${loan.dataemprestimo ? formatarData(loan.dataemprestimo) : "-"}`, margemEsquerda, 56);
    doc.text(`Valor Emprestado: ${formatarValor(loan.valoremprestado)}`, margemEsquerda, 63);
    doc.text(`Valor a Pagar: ${formatarValor(loan.valorpagar)}`, margemEsquerda, 70);
    doc.text(`Juros: ${loan.juros ? formatarValor(loan.juros) : "-"}`, margemEsquerda, 77);
    doc.text(`Porcentagem de Juros: ${loan.porcentagem ?? "-"}`, margemEsquerda, 84);
    doc.text(`Parcelas Totais: ${loan.parcelas ?? "-"}`, margemEsquerda, 91);
    doc.text(`Parcelas Pagas: ${loan.parcelasPagas ?? "-"}`, margemEsquerda, 98);
    doc.text(`Parcelas Pendentes: ${loan.parcelasPendentes ?? "-"}`, margemEsquerda, 105);
    doc.text(`Parcelas Atrasadas: ${loan.parcelasAtrasadas ?? "-"}`, margemEsquerda, 112);
    doc.text(`Valor de Cada Parcela: ${loan.valorParcela ? formatarValor(loan.valorParcela) : "-"}`, margemEsquerda, 119);
    doc.text(`Valor Já Pago: ${loan.valorJaPago ? formatarValor(loan.valorJaPago) : "-"}`, margemEsquerda, 126);
    doc.text(`Valor Pendente: ${loan.valorPendente ? formatarValor(loan.valorPendente) : "-"}`, margemEsquerda, 133);

    const valorAtrasado = (loan.parcelasAtrasadas ?? 0) * (loan.valorParcela ?? 0);
    doc.text(`Valor Atrasado: ${formatarValor(valorAtrasado)}`, margemEsquerda, 140);

    doc.text(`Status do Empréstimo: ${loan.statos ?? "-"}`, margemEsquerda, 147);

    doc.setFontSize(12);
    doc.text("Observações:", margemEsquerda, 154);
    const splitObs = doc.splitTextToSize(loan.obs || "-", 170);
    doc.text(splitObs, margemEsquerda, 161);

    if (loan.proximasParcelas && loan.proximasParcelas.length > 0) {
      const tabelaParcelas = loan.proximasParcelas.map((p, index) => [
        index + 1,
        formatarData(p.data_vencimento),
        p.valor_parcela ? formatarValor(p.valor_parcela) : "-",
        p.status || "Pendente",
        p.data_pagamento ? formatarDataRelatorio(p.data_pagamento) : "-"
      ]);

      autoTable(doc, {
        startY: 180 + splitObs.length * 6,
        head: [["#", "Data Vencimento", "Valor Parcela", "Status", "Data Pagamento"]],
        body: tabelaParcelas,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "center" },
        bodyStyles: { halign: "center" },
        margin: { left: margemEsquerda, right: margemEsquerda },
        styles: { fontSize: 11 }
      });
    }

    doc.save(`Relatorio_Emprestimo_${loan.id}_${loan.cliente}.pdf`);
  };

  const formatarDataRelatorio = (dataString) => {
    if (!dataString) return ""
    const data = new Date(dataString)
    const dia = String(data.getDate()).padStart(2, "0")
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const ano = data.getFullYear()
    const horas = String(data.getHours()).padStart(2, "0")
    const minutos = String(data.getMinutes()).padStart(2, "0")
    const segundos = String(data.getSeconds()).padStart(2, "0")
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`
  }



  const formatarData = (dataString) => {
    if (!dataString) return ""
    const data = new Date(dataString)
    const dia = String(data.getDate()).padStart(2, "0")
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const ano = data.getFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const formatarValor = (valor) => {
    if (valor === null || valor === undefined) return "-"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  const handleClienteChange = (e) => {
    const value = e.target.value
    setNovoEmprestimo({ ...novoEmprestimo, cliente: value })
    if (value.length > 0) {
      const sugestoesFiltradas = clientesCadastrados.filter((c) =>
        c.nome.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(sugestoesFiltradas)
    } else {
      setSuggestions([])
    }
  }

  const openEditarEmprestimoModal = (loan) => {
    setEmprestimoEditando({
      ...loan,
      cliente: loan.cliente,
      valorEmprestado: loan.valoremprestado,
      valorPagar: loan.valorpagar,
      parcelas: loan.parcelas,
      data: loan.dataemprestimo,
      obs: loan.obs,
    });
    setIsEditarEmprestimoOpen(true);
  };


  const salvarEdicaoEmprestimo = async () => {
    const { id, cliente, valorEmprestado, valorPagar, parcelas, data, obs } = emprestimoEditando;

    if (!cliente || !valorEmprestado || !valorPagar || !parcelas || !data) {
      alert("⚠️ Preencha todos os campos antes de salvar!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/emprestimos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cliente,
          valoremprestado: parseFloat(valorEmprestado),
          valorpagar: parseFloat(valorPagar),
          parcelas: parseInt(parcelas),
          dataemprestimo: data,
          obs: obs || "",
        }),
      });

      const dataRes = await res.json();

      if (!res.ok) {
        alert(dataRes.error || "Erro ao atualizar empréstimo.");
        return;
      }

      const resResumo = await fetch(`${API_URL}/emprestimos/resumo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resumo = await resResumo.json();

      const juros = parseFloat(dataRes.valorpagar) - parseFloat(dataRes.valoremprestado);
      const porcentagem = ((juros / parseFloat(dataRes.valoremprestado)) * 100).toFixed(2) + "%";

      const emprestimoAtualizado = {
        ...dataRes,
        juros: juros.toFixed(2),
        porcentagem,
        parcelasPendentes: resumo.parcelasPendentes,
        parcelasAtrasadas: resumo.parcelasAtrasadas,
        statos: resumo.parcelasPendentes === 0 ? "Pago" : dataRes.statos ?? "-",
        obs: obs || "",
        id_cliente: dataRes.id_cliente || clientesCadastrados.find(c => c.nome === cliente)?.id || null
      };

      setEmprestimos((prev) =>
        prev.map((e) => (e.id === id ? emprestimoAtualizado : e))
      );

      if (selectedLoan && selectedLoan.id === id) {
        const token = localStorage.getItem("token");

        try {
          const resResumo = await fetch(`${API_URL}/emprestimos/resumo/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const resumo = await resResumo.json();

          const resParcelas = await fetch(`${API_URL}/emprestimos/${id}/proximasParcelas`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const proximasParcelas = await resParcelas.json();

          setSelectedLoan({
            ...emprestimoAtualizado,
            ...resumo,
            id_cliente: emprestimoAtualizado.id_cliente ||
              clientesCadastrados.find(c => c.nome === emprestimoAtualizado.cliente)?.id || null,
            proximasParcelas: Array.isArray(proximasParcelas) ? proximasParcelas : [],
          });
        } catch (err) {
          console.error("Erro ao atualizar resumo/parcela:", err);
          setSelectedLoan(emprestimoAtualizado);
        }
      }

      setIsEditarEmprestimoOpen(false);
      setEmprestimoEditando(null);
      alert("Empréstimo atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar empréstimo.");
    }
  };





  const selectSuggestion = (nome) => {
    setNovoEmprestimo({ ...novoEmprestimo, cliente: nome })
    setSuggestions([])
  }
  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario")
    if (!tipo) {
      window.location.href = "/"
    } else {
      setTipoUsuario(tipo)
    }
    const token = localStorage.getItem("token");
    if (!token) return;

    const carregarDados = async () => {
      try {
        const resClientes = await fetch(`${API_URL}/clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dadosClientes = await resClientes.json();
        setClientesCadastrados(dadosClientes);

        const resEmp = await fetch(`${API_URL}/emprestimos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dadosEmp = await resEmp.json();

        const resJuros = await fetch(`${API_URL}/emprestimos/juros`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dadosJuros = await resJuros.json();

        const emprestimosCompletos = await Promise.all(
          dadosEmp.map(async (e) => {
            const jurosData = dadosJuros.find((j) => j.id === e.id);
            const resResumo = await fetch(`${API_URL}/emprestimos/resumo/${e.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const resumo = await resResumo.json();

            const clienteInfo = dadosClientes.find((c) => c.nome === e.cliente);

            return {
              ...e,
              juros: jurosData ? jurosData.juros : null,
              porcentagem: jurosData ? jurosData.porcentagem : null,
              parcelasPendentes: resumo.parcelasPendentes,
              parcelasAtrasadas: resumo.parcelasAtrasadas,
              statos: resumo.parcelasPendentes === 0 ? "Pago" : e.statos ?? "-",
              id_cliente: e.id_cliente || clienteInfo?.id || null,
            };
          })
        );

        setEmprestimos(emprestimosCompletos);
      } catch (err) {
        console.error(err);
      }
    };

    carregarDados();
  }, []);

  const salvarNovoEmprestimo = async () => {
    const { cliente, valorEmprestado, valorPagar, parcelas, data } = novoEmprestimo;
    if (!cliente || !valorEmprestado || !valorPagar || !parcelas || !data) {
      alert("⚠️ Preencha todos os campos antes de salvar!");
      return;
    }
    const clienteExiste = clientesCadastrados.some(
      (c) => c.nome.toLowerCase() === cliente.toLowerCase()
    );
    if (!clienteExiste) {
      alert("⚠️ O cliente informado não está cadastrado!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/emprestimos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          cliente,
          valoremprestado: parseFloat(valorEmprestado),
          valorpagar: parseFloat(valorPagar),
          parcelas: parseInt(parcelas),
          dataemprestimo: data,
          obs: novoEmprestimo.obs || "",
        }),
      });
      const dataRes = await res.json();

      if (res.ok) {
        const resResumo = await fetch(`${API_URL}/emprestimos/resumo/${dataRes.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resumo = await resResumo.json();

        const juros = parseFloat(dataRes.valorpagar) - parseFloat(dataRes.valoremprestado);
        const porcentagem = ((juros / parseFloat(dataRes.valoremprestado)) * 100).toFixed(2) + "%";

        const emprestimoCompleto = {
          ...dataRes,
          juros: juros.toFixed(2),
          porcentagem,
          parcelasPendentes: resumo.parcelasPendentes,
          parcelasAtrasadas: resumo.parcelasAtrasadas,
          statos: resumo.parcelasPendentes === 0 ? "Pago" : "-",
          id_cliente: clientesCadastrados.find((c) => c.nome === cliente)?.id || null,
          observacoes: dataRes.obs || "",
        };

        setEmprestimos([emprestimoCompleto, ...emprestimos]);
        setNovoEmprestimo({ cliente: "", valorEmprestado: "", valorPagar: "", parcelas: "", data: "", obs: "" });
        setIsNovoEmprestimoOpen(false);
      } else {
        alert(dataRes.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar empréstimo.");
    }
  };

  const openModal = async (loan) => {
    const token = localStorage.getItem("token");

    try {
      const resResumo = await fetch(`${API_URL}/emprestimos/resumo/${loan.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resumo = await resResumo.json();

      const resParcelas = await fetch(`${API_URL}/emprestimos/${loan.id}/proximasParcelas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const proximasParcelas = await resParcelas.json();

      const statosAtualizado = resumo.parcelasPendentes === 0 ? "Pago" : loan.statos;

      setSelectedLoan({
        ...loan,
        ...resumo,
        id_cliente: loan.id_cliente || clientesCadastrados.find(c => c.nome === loan.cliente)?.id || null,
        statos: statosAtualizado,
        proximasParcelas: Array.isArray(proximasParcelas) ? proximasParcelas : [],
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao abrir detalhes do empréstimo.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLoan(null)
  }

  const filteredEmprestimos = emprestimos.filter(
    (e) =>
      e.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toString().includes(searchTerm)
  )

  const handleClienteChangeEditar = (e) => {
    const value = e.target.value;
    setEmprestimoEditando({ ...emprestimoEditando, cliente: value });

    if (value.length > 0) {
      const sugestoesFiltradas = clientesCadastrados.filter((c) =>
        c.nome.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(sugestoesFiltradas);
    } else {
      setSuggestions([]);
    }
  };

  const renderModalDetalhesEmprestimo = () => {
    if (!isModalOpen || !selectedLoan) return null
    const {
      id,
      cliente,
      id_cliente,
      valoremprestado,
      valorpagar,
      parcelas,
      juros,
      porcentagem,
      parcelasPagas,
      parcelasPendentes,
      parcelasAtrasadas,
      valorParcela,
      valorJaPago,
      valorPendente,
      dataemprestimo,
      obs,
    } = selectedLoan

    return (
      <div className={styles.emprestimoModalOverlay} onClick={closeModal}>
        <div className={styles.emprestimoModalCard} onClick={(e) => e.stopPropagation()}>
          <h2 className={styles.emprestimoModalTitle}>Detalhes do Empréstimo</h2>
          <div className={styles.emprestimoModalBody}>
            <p><strong>ID Empréstimo:</strong> {id ?? "-"}</p>
            <p><strong>ID Cliente:</strong> {id_cliente ?? "-"}</p>
            <p><strong>Cliente:</strong> {cliente ?? "-"}</p>
            <p><strong>Valor Emprestado:</strong> {formatarValor(valoremprestado)}</p>
            <p><strong>Valor a Pagar:</strong> {formatarValor(valorpagar)}</p>
            <p><strong>Juros:</strong> {juros ? formatarValor(juros) : "-"}</p>
            <p><strong>Porcentagem:</strong> {porcentagem ?? "-"}</p>
            <p><strong>Parcelas:</strong> {parcelas ?? "-"}</p>
            <p><strong>Parcelas Pendentes:</strong> {parcelasPendentes ?? "-"}</p>
            <p><strong>Parcelas Pagas:</strong> {parcelasPagas ?? "-"}</p>
            <p><strong>Parcelas Atrasadas:</strong> {parcelasAtrasadas ?? "-"}</p>
            <p><strong>Valor de Cada Parcela:</strong> {formatarValor(valorParcela) ?? "-"}</p>
            <p><strong>Valor Já Pago:</strong> {formatarValor(valorJaPago) ?? valorJaPago ?? "-"}</p>
            <p><strong>Valor Pendente:</strong> {formatarValor(valorPendente) ?? valorPendente ?? "-"}</p>
            <p><strong>Valor Atrasado:</strong> {formatarValor((parcelasAtrasadas ?? 0) * (valorParcela ?? 0))}</p>
            <p><strong>Data do Empréstimo:</strong> {dataemprestimo ? formatarData(dataemprestimo) : "-"}</p>
            <p>
              <strong>Próximos Vencimentos:</strong>{" "}
              {selectedLoan.proximasParcelas && selectedLoan.proximasParcelas.length > 0 ? (
                selectedLoan.proximasParcelas.map((p) => (
                  <span key={p.id}>
                    {formatarData(p.data_vencimento)} ({p.status || "Pendente"}) <br />
                  </span>
                ))
              ) : (
                <span>Sem parcelas pendentes</span>
              )}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {parcelasPendentes === 0 && parcelasAtrasadas === 0
                ? "Pago"
                : parcelasAtrasadas > 0
                  ? "Em Atraso"
                  : "Pendente"}
            </p>
            <p><strong>Observações:</strong> {obs || "-"}</p>
          </div>
          <div className={styles.emprestimoModalActions}>
            <button className={styles.emprestimoModalFecharBtn} onClick={closeModal}>Fechar</button>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token")
                  const res = await fetch(`${API_URL}/emprestimos/${selectedLoan.id}/pago`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  const data = await res.json()
                  if (!res.ok) {
                    alert(data.error || "Erro ao marcar empréstimo como pago.")
                    return
                  }
                  setEmprestimos(emprestimos.filter((e) => e.id !== selectedLoan.id))
                  closeModal()
                  alert("Empréstimo marcado como pago!")
                } catch (err) {
                  console.error(err)
                  alert("Erro ao marcar como pago.")
                }
              }}
            >
              Pago
            </button>
            <button
              onClick={() => openEditarEmprestimoModal(selectedLoan)}
            >
              Editar
            </button>
            <button
              onClick={async () => {
                if (!window.confirm("Tem certeza que deseja apagar este empréstimo?")) return
                try {
                  const token = localStorage.getItem("token")
                  const res = await fetch(`${API_URL}/emprestimos/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  if (res.ok) {
                    setEmprestimos(emprestimos.filter((e) => e.id !== id))
                    closeModal()
                    alert("Empréstimo apagado com sucesso!")
                  }
                } catch (err) {
                  console.error(err)
                  alert("Erro ao apagar empréstimo.")
                }
              }}
            >
              Apagar
            </button>
            <button
              onClick={() =>
                (window.location.href = `/parcelas?id=${selectedLoan?.id}&cliente=${selectedLoan?.cliente}`)
              }
            >
              Parcelas
            </button>
            <button onClick={() => gerarRelatorioPDF(selectedLoan)}>Gerar Relatório</button>
          </div>
        </div>
      </div>
    )
  }

  const renderModalNovoEmprestimo = () => {
    if (!isNovoEmprestimoOpen) return null;

    return (
      <div className={styles.modalOverlay} onClick={() => setIsNovoEmprestimoOpen(false)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={() => setIsNovoEmprestimoOpen(false)}>
            &times;
          </button>
          <h2 className={styles.modalTitle}>Novo Empréstimo</h2>
          <div className={styles.modalBody}>
            <div className={styles.card}>
              <label>Nome do Cliente</label>
              <input
                type="text"
                value={novoEmprestimo.cliente}
                onChange={handleClienteChange}
                onKeyDown={(e) => {
                  if (suggestions.length === 0) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) =>
                      prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) =>
                      prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (selectedSuggestionIndex >= 0) {
                      selectSuggestion(suggestions[selectedSuggestionIndex].nome);
                    }
                  }
                }}
                autoComplete="off"
              />
              {suggestions.length > 0 && isNovoEmprestimoOpen && (
                <ul className={styles.suggestions}>
                  {suggestions.map((c, index) => (
                    <li
                      key={c.id}
                      onClick={() => selectSuggestion(c.nome)}
                      className={index === selectedSuggestionIndex ? styles.suggestionActive : ""}
                    >
                      {c.nome}
                    </li>
                  ))}
                </ul>
              )}

              <label>Valor Emprestado</label>
              <input
                type="number"
                value={novoEmprestimo.valorEmprestado}
                onChange={(e) =>
                  setNovoEmprestimo({ ...novoEmprestimo, valorEmprestado: e.target.value })
                }
                required
              />
              <label>Valor a Pagar</label>
              <input
                type="number"
                value={novoEmprestimo.valorPagar}
                onChange={(e) =>
                  setNovoEmprestimo({ ...novoEmprestimo, valorPagar: e.target.value })
                }
                required
              />
              <label>Número de Parcelas</label>
              <input
                type="number"
                value={novoEmprestimo.parcelas}
                onChange={(e) =>
                  setNovoEmprestimo({ ...novoEmprestimo, parcelas: e.target.value })
                }
                required
              />
              <label>Data do Empréstimo</label>
              <input
                type="date"
                value={novoEmprestimo.data}
                onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, data: e.target.value })}
                required
              />
              <label>Observação do Empréstimo</label>
              <textarea
                className={styles.textareaObs}
                value={novoEmprestimo.obs}
                onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, obs: e.target.value })}
                placeholder="Escreva observações sobre este empréstimo..."
              />
            </div>
            <button className={styles.botaoSalvar} onClick={salvarNovoEmprestimo}>
              Salvar Empréstimo
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderModalEditarEmprestimo = () => {
    if (!isEditarEmprestimoOpen || !emprestimoEditando) return null;

    const formatarDataParaInput = (data) => {
      if (!data) return "";
      if (data.includes("-")) return data.slice(0, 10);
      const [dia, mes, ano] = data.split("/");
      return `${ano}-${mes}-${dia}`;
    };

    return (
      <div className={styles.modalOverlay} onClick={() => setIsEditarEmprestimoOpen(false)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.modalClose} onClick={() => setIsEditarEmprestimoOpen(false)}>
            &times;
          </button>
          <h2 className={styles.modalTitle}>Editar Empréstimo</h2>
          <div className={styles.modalBody}>
            <div className={styles.card}>
              <label>Cliente</label>
              <input
                type="text"
                value={emprestimoEditando.cliente}
                onChange={handleClienteChangeEditar}
                onKeyDown={(e) => {
                  if (suggestions.length === 0) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) =>
                      prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) =>
                      prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (selectedSuggestionIndex >= 0) {
                      selectSuggestion(suggestions[selectedSuggestionIndex].nome);
                    }
                  }
                }}
                autoComplete="off"
                required
              />
              {suggestions.length > 0 && isEditarEmprestimoOpen && (
                <ul className={styles.suggestions}>
                  {suggestions.map((c, index) => (
                    <li
                      key={c.id}
                      onClick={() => selectSuggestion(c.nome)}
                      className={index === selectedSuggestionIndex ? styles.suggestionActive : ""}
                    >
                      {c.nome}
                    </li>
                  ))}
                </ul>
              )}

              <label>Valor Emprestado</label>
              <input
                type="number"
                value={emprestimoEditando.valorEmprestado}
                onChange={(e) =>
                  setEmprestimoEditando({ ...emprestimoEditando, valorEmprestado: e.target.value })
                }
                required
              />
              <label>Valor a Pagar</label>
              <input
                type="number"
                value={emprestimoEditando.valorPagar}
                onChange={(e) =>
                  setEmprestimoEditando({ ...emprestimoEditando, valorPagar: e.target.value })
                }
                required
              />
              <label>Número de Parcelas</label>
              <input
                type="number"
                value={emprestimoEditando.parcelas}
                onChange={(e) =>
                  setEmprestimoEditando({ ...emprestimoEditando, parcelas: e.target.value })
                }
                required
              />
              <label>Data do Empréstimo</label>
              <input
                type="date"
                value={formatarDataParaInput(emprestimoEditando.data)}
                onChange={(e) =>
                  setEmprestimoEditando({ ...emprestimoEditando, data: e.target.value })
                }
                required
              />
              <label>Observação do Empréstimo</label>
              <textarea
                className={styles.textareaObs}
                value={emprestimoEditando.obs}
                onChange={(e) => setEmprestimoEditando({ ...emprestimoEditando, obs: e.target.value })}
                placeholder="Escreva observações sobre este empréstimo..."
              />
            </div>
            <button className={styles.botaoSalvar} onClick={salvarEdicaoEmprestimo}>
              Salvar Alterações
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
        <button className={styles.botaoNovo} onClick={() => setIsNovoEmprestimoOpen(true)}>+ Novo Empréstimo</button>
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
                <tr key={`${e.id}-${e.cliente}`} className={styles.tabelaRow} onClick={() => openModal(e)}>
                  <td>{e.id}</td>
                  <td className={styles.clienteClicavel}>👁️ {e.cliente}</td>
                  <td>{formatarData(e.dataemprestimo)}</td>
                  <td>{" "}
                    {e.parcelasPendentes === 0 && e.parcelasAtrasadas === 0
                      ? "Pago"
                      : e.parcelasAtrasadas > 0
                        ? "Em Atraso"
                        : "Pendente"}</td>
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
      {renderModalDetalhesEmprestimo()}
      {renderModalNovoEmprestimo()}
      {isEditarEmprestimoOpen && renderModalEditarEmprestimo()}
    </div>
  )

  const renderMenu =
    tipoUsuario === "admin" ? (
      <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>{renderEmprestimos()}</MenuDonos>
    ) : tipoUsuario === "user" ? (
      <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>{renderEmprestimos()}</MenuUsers>
    ) : (
      <p>Carregando...</p>
    )

  return <>{renderMenu}</>
}

export default Emprestimos
