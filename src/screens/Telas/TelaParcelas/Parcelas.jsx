import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Parcelas.module.css";
import API_URL from "../../../api";

function Parcelas({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [parcelas, setParcelas] = useState([]);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }

    const token = localStorage.getItem("token");
    const searchParams = new URLSearchParams(window.location.search);
    const id_emprestimo = searchParams.get("id");
    const cliente = searchParams.get("cliente");

    if (token) {
      const carregarParcelas = async () => {
        try {
          const res = await fetch(
            `${API_URL}/parcelas?id_emprestimo=${id_emprestimo}&cliente=${cliente}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const dados = await res.json();
          const parcelasFormatadas = dados.map((p) => ({
            id: p.id,
            numeroParcela: p.numero_parcela,
            idEmprestimo: p.id_emprestimo,
            cliente: p.cliente,
            dataVencimento: p.data_vencimento
              ? new Date(p.data_vencimento).toLocaleDateString("pt-BR")
              : "",
            valor: parseFloat(p.valor_parcela),
            status: p.status,
            totalParcelas: p.total_parcelas,
            dataPagamento: p.data_pagamento
              ? new Date(p.data_pagamento).toLocaleString("pt-BR")
              : null,
          }));
          setParcelas(parcelasFormatadas);
        } catch (err) {
          console.error(err);
        }
      };
      carregarParcelas();
    }
  }, []);

  const alternarStatus = async (index) => {
    const parcela = parcelas[index];

    const novoStatus = parcela.status === "Pago" ? "Pendente" : "Pago";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/parcelas/${parcela.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      const data = await response.json();

      const novasParcelas = [...parcelas];
      novasParcelas[index].status = data.statusParcela;

      novasParcelas[index].dataPagamento =
        novasParcelas[index].status === "Pago"
          ? new Date().toLocaleString("pt-BR")
          : null;

      setParcelas(novasParcelas);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar o status da parcela.");
    }
  };


  const renderParcelas = () => (
    <div className={`${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.parcelasBox}>
        {parcelas.map((p, i) => (
          <div key={i} className={styles.parcelaCard}>
            <h3>{p.cliente}</h3>
            <p>
              <strong>ID do Empréstimo:</strong> {p.idEmprestimo}
            </p>
            <p>
              <strong>Número da Parcela:</strong> {p.numeroParcela}/
              {p.totalParcelas}
            </p>
            <p>
              <strong>Data de Vencimento:</strong> {p.dataVencimento}
            </p>
            <p>
              <strong>Valor da Parcela:</strong> R$ {p.valor.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  p.status === "Pago" ? styles.statusPago : styles.statusPendente
                }
              >
                {p.status}
              </span>
            </p>
            <p>
              <strong>Data de Pagamento:</strong>{" "}
              {p.dataPagamento || "Ainda não pago"}
            </p>
            <button
              className={styles.botaoStatus}
              onClick={() => alternarStatus(i)}
            >
              {p.status === "Pago" ? "Marcar como Pendente" : "Marcar como Pago"}
            </button>
          </div>
        ))}
        {parcelas.length === 0 && (
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

export default Parcelas;
