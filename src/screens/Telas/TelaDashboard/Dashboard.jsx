import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../api";

function Dashboard({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalEmprestimos, setTotalEmprestimos] = useState(0);
  const [totalAtrasados, setTotalAtrasados] = useState(0);
  const [totalCaixinha, setTotalCaixinha] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [valorEdicao, setValorEdicao] = useState("");
  const [totalParcelasMes, setTotalParcelasMes] = useState(0);
  const [totalPagamentosHoje, setTotalPagamentosHoje] = useState(0);
  const [totalPagasHoje, setTotalPagasHoje] = useState(0);
  const [totalValorEmprestado, setTotalValorEmprestado] = useState(0);
  const [totalValorEmprestadoMes, setTotalValorEmprestadoMes] = useState(0);
  const [totalValorEmprestadoHoje, setTotalValorEmprestadoHoje] = useState(0);
  const [totalLucroAReceber, setLucroTotalAReceber] = useState([]);
  const [totalLucroAReceberMes, setLucroTotalAReceberMes] = useState([]);
  const [totalLucroARecebidoMes, setLucroTotalARecebidoMes] = useState([]);
  const [totalInvestimentoAcumulado, setTotalInvestimentoAcumulado] = useState(0);
  const [dataConsulta, setDataConsulta] = useState("");
  const [showModalMes, setShowModalMes] = useState(false);
  const [resumoMes, setResumoMes] = useState({ lucro: 0, investimento: 0 });

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
  }, []);

  useEffect(() => {
    const fetchTotalClientes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/clientes/quantidade`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTotalClientes(data.totalClientes);
        }
      } catch (err) {
        console.error("Erro ao buscar quantidade de clientes", err);
      }
    };
    fetchTotalClientes();
  }, []);

  useEffect(() => {
    const fetchTotalEmprestimos = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/quantidade`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTotalEmprestimos(data.totalEmprestimos);
        }
      } catch (err) {
        console.error("Erro ao buscar quantidade de clientes", err);
      }
    };
    fetchTotalEmprestimos();
  }, []);

  useEffect(() => {
    const fetchEmprestimosAtrasados = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/emprestimos/ematraso`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar empréstimos em atraso");
        }

        const data = await response.json();
        setTotalAtrasados(data.totalEmprestimosAtrasados);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmprestimosAtrasados();
  }, []);

  useEffect(() => {
    const fetchTotalPagamentosHoje = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/parcelas/clientes-hoje`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTotalPagamentosHoje(data.totalClientesHoje);
      } catch (err) {
        console.error("Erro ao buscar clientes com pagamentos para hoje", err);
      }
    };
    fetchTotalPagamentosHoje();
  }, []);

  useEffect(() => {
    const fetchTotalPagamentosMes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/parcelas/clientes-mes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTotalParcelasMes(data.totalClientesMes);
      } catch (err) {
        console.error("Erro ao buscar clientes com pagamentos neste mês", err);
      }
    };
    fetchTotalPagamentosMes();
  }, []);

  useEffect(() => {
    const fetchTotalPagasHoje = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/parcelas/pagas-hoje`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTotalPagasHoje(data.totalPagasHoje);
      } catch (err) {
        console.error("Erro ao buscar parcelas pagas hoje", err);
      }
    };

    fetchTotalPagasHoje();
  }, []);

  useEffect(() => {
    const fetchTotalValorEmprestado = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/total-emprestado`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTotalValorEmprestado(data.totalValorEmprestado);
      } catch (err) {
        console.error("Erro ao buscar total de empréstimos pendentes ou em atraso", err);
      }
    };

    fetchTotalValorEmprestado();
  }, []);

  useEffect(() => {
    const fetchTotalInvestimentoAcumulado = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/total-investimento-acumulado`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTotalInvestimentoAcumulado(data.totalInvestimentoAcumulado);
      } catch (err) {
        console.error("Erro ao buscar total de empréstimos pendentes ou em atraso", err);
      }
    };

    fetchTotalInvestimentoAcumulado();
  }, []);

  useEffect(() => {
    const fetchTotalValorEmprestadoMes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/total-emprestado-mes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTotalValorEmprestadoMes(data.totalValorEmprestadoMes);
      } catch (err) {
        console.error("Erro ao buscar total de empréstimos do mês", err);
      }
    };

    fetchTotalValorEmprestadoMes();
  }, []);

  useEffect(() => {
    const fetchTotalValorEmprestadoHoje = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/total-emprestado-hoje`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setTotalValorEmprestadoHoje(data.totalValorEmprestadoHoje);
      } catch (err) {
        console.error("Erro ao buscar total de empréstimos de hoje", err);
      }
    };

    fetchTotalValorEmprestadoHoje();
  }, []);

  useEffect(() => {
    const fetchLucroTotalAReceber = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/lucro-total-a-receber`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setLucroTotalAReceber(data.lucroTotalAReceber || 0);
      } catch (err) {
        console.error("Erro ao buscar lucro total a receber", err);
      }
    };

    fetchLucroTotalAReceber();
  }, []);

  useEffect(() => {
    const fetchLucroTotalAReceberMes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/lucro-total-a-receber-mes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setLucroTotalAReceberMes(data.lucroTotalAReceberMes || 0);
      } catch (err) {
        console.error("Erro ao buscar lucro total a receber Mes", err);
      }
    };

    fetchLucroTotalAReceberMes();
  }, []);

  useEffect(() => {
    const fetchLucroTotalARecebidoMes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/emprestimos/lucro-total-recebido-mes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setLucroTotalARecebidoMes(data.totalLucroARecebidoMes || 0);
      } catch (err) {
        console.error("Erro ao buscar lucro total a receber Mes", err);
      }
    };

    fetchLucroTotalARecebidoMes();
  }, []);

  useEffect(() => {
    const fetchCaixinha = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/caixinha/total`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTotalCaixinha(data.totalCaixinha || 0);
      } catch (err) {
        console.error("Erro ao buscar total da caixinha:", err);
      }
    };
    fetchCaixinha();
  }, []);

  const abrirModal = () => {
    setValorEdicao("");
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
  };

  const salvarCaixinha = async (tipo) => {
    if (!valorEdicao || isNaN(valorEdicao)) return;
    const valor = tipo === "add" ? Number(valorEdicao) : -Number(valorEdicao);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/caixinha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ valor }),
      });
      const data = await res.json();
      if (res.ok) {
        setTotalCaixinha(data.caixinha.valor);
      }
    } catch (err) {
      console.error("Erro ao atualizar caixinha:", err);
    }
    fecharModal();
  };

  const formatarValor = (valor) => {
    if (valor === null || valor === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (dataString) => {
    if (!dataString) return ""
    const [ano, mes] = dataString.split("-")

    const ultimoDia = new Date(ano, mes, 0).getDate()

    return `${String(ultimoDia).padStart(2, "0")}/${mes}/${ano}`
  }

  const renderMenu = () => {
    if (tipoUsuario === "admin") {
      return (
        <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          <div className={styles.grid}>
            <div className={styles.caixa} onClick={() => navigate("/clientes")}>
              <h3>Clientes Cadastrados</h3>
              <p>{totalClientes}</p>
            </div>

            <div
              className={styles.caixa}
              onClick={() => navigate("/emprestimos")}
            >
              <h3>Empréstimos Registrados</h3>
              <p>{totalEmprestimos}</p>
            </div>

            <div
              className={styles.caixa}
              onClick={() => navigate("/pagamentosatrasados")}
            >
              <h3>Empréstimos em Atraso</h3>
              <p>{totalAtrasados}</p>
            </div>

            <div
              className={styles.caixa}
              onClick={() => navigate("/pagarhoje")}
            >
              <h3>Clientes Com Pagamentos Para Hoje</h3>
              <p>{totalPagamentosHoje}</p>
            </div>

            <div className={styles.caixa} onClick={() => navigate("/pagarmes")}>
              <h3>Clientes com Pagamentos Neste Mês</h3>
              <p>{totalParcelasMes}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Pagamentos Recebidos Hoje</h3>
              <p>{totalPagasHoje}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Valor Total Emprestado</h3>
              <p>R${formatarValor(totalValorEmprestado).replace("R$", "")}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Valor Emprestado no Mês</h3>
              <p>R${formatarValor(totalValorEmprestadoMes).replace("R$", "")}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Valor Emprestado Hoje</h3>
              <p>R${formatarValor(totalValorEmprestadoHoje).replace("R$", "")}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Lucro Total a Receber</h3>
              <p>R${formatarValor(totalLucroAReceber).replace("R$", "")}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Lucro Mensal Estimado</h3>
              <p>R${formatarValor(totalLucroAReceberMes).replace("R$", "")}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Investimento Acumulado</h3>
              <p>R${formatarValor(totalInvestimentoAcumulado).replace("R$", "")}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Consultar Lucro por Mês</h3>
              <input
                type="month"
                className={styles.input}
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
              <button
                className={styles.botao}
                onClick={async () => {
                  if (!dataConsulta) return;

                  const [ano, mes] = dataConsulta.split("-");
                  const token = localStorage.getItem("token");

                  try {
                    const res = await fetch(`${API_URL}/resumo-mensal/${ano}/${mes}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setResumoMes(data);
                      setShowModalMes(true);
                    }
                  } catch (err) {
                    console.error("Erro ao buscar resumo mensal:", err);
                  }
                }}
              >
                Buscar
              </button>
            </div>

            <div className={styles.caixa}>
              <h3>Lucro Recebido no Mês</h3>
              <p>R${formatarValor(totalLucroARecebidoMes).replace("R$", "")}</p>
            </div>

            <div className={styles.caixa}>
              <h3>Fundo de Reserva</h3>
              <p>
                R$ {Number(totalCaixinha).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <button className={styles.botao} onClick={abrirModal}>Editar Caixinha</button>
            </div>
          </div>
        </MenuDonos>
      );
    } else if (tipoUsuario === "user") {
      return (
        <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          <div className={styles.grid}>
            <div className={styles.caixa} onClick={() => navigate("/clientes")}>
              <h3>Clientes Cadastrados</h3>
              <p>234</p>
            </div>

            <div
              className={styles.caixa}
              onClick={() => navigate("/emprestimos")}
            >
              <h3>Empréstimos Registrados</h3>
              <p>152</p>
            </div>

            <div
              className={styles.caixa}
              onClick={() => navigate("/pagamentosatrasados")}
            >
              <h3>Empréstimos em Atraso</h3>
              <p>37</p>
            </div>

            <div
              className={styles.caixa}
              onClick={() => navigate("/pagarhoje")}
            >
              <h3>Pagamentos Pendentes de Hoje</h3>
              <p>12</p>
            </div>

            <div className={styles.caixa} onClick={() => navigate("/pagarmes")}>
              <h3>Clientes com Pagamentos Neste Mês</h3>
              <p>58</p>
            </div>

            <div className={styles.caixa}>
              <h3>Pagamentos Recebidos Hoje</h3>
              <p>19</p>
            </div>

            <div className={styles.caixa}>
              <h3>Valor Total Emprestado</h3>
              <p>R$ 42.000,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Valor Emprestado no Mês</h3>
              <p>R$ 10.500,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Valor Emprestado Hoje</h3>
              <p>R$ 1.800,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Lucro Total a Receber</h3>
              <p>R$ 6.250,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Lucro Mensal Estimado</h3>
              <p>R$ 2.300,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Investimento Acumulado</h3>
              <p>R$ 97.000,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Consultar Lucro por Data</h3>
              <input type="date" className={styles.input} />
              <button className={styles.botao}>Buscar</button>
            </div>

            <div className={styles.caixa}>
              <h3>Lucro Recebido no Mês</h3>
              <p>R$ 3.750,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Fundo de Reserva</h3>
              <p>
                R$ {Number(totalCaixinha).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <button className={styles.botao} onClick={abrirModal}>Editar Caixinha</button>
            </div>
          </div>
        </MenuUsers>
      );
    } else {
      return <p>Carregando...</p>;
    }
  };

  return (
    <>
      {renderMenu()}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Editar Fundo de Reserva</h2>
            <input
              type="number"
              placeholder="Digite o valor"
              value={valorEdicao}
              onChange={(e) => setValorEdicao(e.target.value)}
              className={styles.modalInput}
            />
            <div className={styles.modalButtons}>
              <button
                className={`${styles.modalBtn} ${styles.add}`}
                onClick={() => salvarCaixinha("add")}
              >
                Adicionar
              </button>
              <button
                className={`${styles.modalBtn} ${styles.remove}`}
                onClick={() => salvarCaixinha("remove")}
              >
                Diminuir
              </button>
              <button
                className={`${styles.modalBtn} ${styles.cancel}`}
                onClick={fecharModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalMes && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Resumo do Mês</h2>
            <p className={styles.modalText}><strong>Mês Selecionado:</strong> {dataConsulta ? formatarData(dataConsulta) : "-"}</p>
            <p className={styles.modalText}><strong>Investimento:</strong> R$ {Number(resumoMes.investimento).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            <p className={styles.modalTextultimo}><strong>Lucro:</strong> R$ {Number(resumoMes.lucro).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            <div className={styles.modalButtons}>
              <button
                className={`${styles.modalBtn} ${styles.cancel}`}
                onClick={() => setShowModalMes(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
