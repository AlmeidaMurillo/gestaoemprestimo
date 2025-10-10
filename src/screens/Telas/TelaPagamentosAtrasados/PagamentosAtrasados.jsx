import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./PagamentosAtrasados.module.css";
import API_URL from "../../../api";

function PagamentosAtrasados({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [parcelas, setParcelas] = useState([]);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
    const carregarParcelasAtrasadas = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/parcelas/atrasadas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dados = await res.json();
        const parcelasFormatadas = dados.map((p) => ({
          id: p.id,
          numeroParcela: p.numero_parcela,
          totalParcelas: p.totalParcelas,
          idEmprestimo: p.id_emprestimo,
          cliente: p.cliente,
          dataVencimento: p.data_vencimento
            ? new Date(p.data_vencimento).toLocaleDateString("pt-BR")
            : "",
          valor: parseFloat(p.valor_parcela),
          status: p.status,
        }));
        setParcelas(parcelasFormatadas);
      } catch (err) {
        console.error("Erro ao carregar parcelas atrasadas:", err);
      }
    };
    carregarParcelasAtrasadas();
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

  const formatarValor = (valor) => {
    if (valor === null || valor === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const renderParcelas = () => (
    <div className={`${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.parcelasBox}>
        {parcelas.map((p, i) => (
          <div key={i} className={styles.parcelaCard}>
            <p><strong>Cliente:</strong> {p.cliente}</p>
            <p><strong>Parcela:</strong> {p.numeroParcela}/{p.totalParcelas}</p>
            <p><strong>ID Empréstimo:</strong> {p.idEmprestimo}</p>
            <p><strong>Data Vencimento:</strong> {p.dataVencimento}</p>
            <p><strong>Valor:</strong> R$ {formatarValor(p.valor)}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={p.status === "Pago" ? styles.statusPago : styles.statusAtrasada}>
                {p.status}
              </span>
            </p>
            <button className={styles.botaoStatus} onClick={() => alternarStatus(i)}>
              {p.status === "Pago" ? "Marcar como Pendente" : "Marcar como Pago"}
            </button>
          </div>
        ))}
        {parcelas.length === 0 && <p className={styles.notFound}>Nenhuma parcela encontrada.</p>}
      </div>
    </div>
  );

  const renderMenu = () => {
    if (tipoUsuario === "admin") return <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>{renderParcelas()}</MenuDonos>;
    if (tipoUsuario === "user") return <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>{renderParcelas()}</MenuUsers>;
    return <p>Carregando...</p>;
  };

  return <>{renderMenu()}</>;
}

export default PagamentosAtrasados;
