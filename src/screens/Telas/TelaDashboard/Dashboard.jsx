import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

function Dashboard({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState("");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
  }, []);

  const renderMenu = () => {
    if (tipoUsuario === "admin") {
      return (
        <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
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
              <h3>Consultar Lucro por Mês</h3>
              <input type="date" className={styles.input} />
              <button className={styles.botao}>Buscar</button>
            </div>

            <div className={styles.caixa}>
              <h3>Lucro Recebido no Mês</h3>
              <p>R$ 3.750,00</p>
            </div>

            <div className={styles.caixa}>
              <h3>Fundo de Reserva</h3>
              <p>R$ 500,00</p>
              <button className={styles.botao}>Editar Caixinha</button>
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
              <p>R$ 500,00</p>
              <button className={styles.botao}>Editar Caixinha</button>
            </div>
          </div>
        </MenuUsers>
      );
    } else {
      return <p>Carregando...</p>;
    }
  };

  return <>{renderMenu()}</>;
}

export default Dashboard;
