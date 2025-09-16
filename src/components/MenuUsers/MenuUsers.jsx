import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaMoneyBillWave,
  FaChartBar,
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaCog,
  FaHeadset,
  FaUserCircle,
} from "react-icons/fa";

import styles from "./MenuUsers.module.css";

function MenuUsers({ isCollapsed, toggleSidebar, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (...paths) => paths.includes(location.pathname);

  const titles = {
    "/dashboard": "Dashboard",
    "/clientes": "Clientes",
    "/emprestimos": "Empréstimos",
    "/parcelas": "Parcelas",
    "/pagarhoje": "Pagamentos Para Hoje",
    "/pagarmes": "Pagamentos Para o Mês",
    "/pagamentosatrasados": "Pagamentos Atrasados",
    "/emprestimospagos": "Empréstimos Pagos",
    "/configuracoes": "Configurações",
    "/suporte": "Suporte",
    "/perfil": "Perfil",
  };

  const pageTitle = titles[location.pathname];

  return (
    <>
      <div
        className={`${styles.menuContainer} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          {!isCollapsed ? (
            <>
              <div className={styles.logoContainer}>
                <div className={styles.logo}>MultiAlmeida</div>
                <h2 className={styles.subtitle}>Gestão De Empréstimos</h2>
              </div>
              <button
                className={styles.toggleBtn}
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
              >
                {"<"}
              </button>
            </>
          ) : (
            <button
              className={styles.toggleBtn}
              onClick={toggleSidebar}
              aria-label="Toggle Menu"
            >
              {">"}
            </button>
          )}
        </div>

        <aside
          className={`${styles.sidebar} ${
            isCollapsed ? styles.sidebarCollapsed : ""
          }`}
        >
          <nav className={styles.menu}>
            <ul className={styles.menuUl}>
              <li
                onClick={() => navigate("/dashboard")}
                className={`${styles.menuLi} ${
                  isActive("/dashboard") ? styles.active : ""
                }`}
              >
                <FaHome className={styles.icon} />
                {!isCollapsed && "Dashboard"}
              </li>

              <li
                onClick={() => navigate("/clientes")}
                className={`${styles.menuLi} ${
                  isActive("/clientes") ? styles.active : ""
                }`}
              >
                <FaUser className={styles.icon} />
                {!isCollapsed && "Clientes"}
              </li>

              <li
                onClick={() => navigate("/emprestimos")}
                className={`${styles.menuLi} ${
                  isActive("/emprestimos", "/parcelas") ? styles.active : ""
                }`}
              >
                <FaMoneyBillWave className={styles.icon} />
                {!isCollapsed && "Empréstimos"}
              </li>

              <li
                onClick={() => navigate("/pagarhoje")}
                className={`${styles.menuLi} ${
                  isActive("/pagarhoje") ? styles.active : ""
                }`}
              >
                <FaChartBar className={styles.icon} />
                {!isCollapsed && "Pagamentos Para Hoje"}
              </li>

              <li
                onClick={() => navigate("/pagarmes")}
                className={`${styles.menuLi} ${
                  isActive("/pagarmes") ? styles.active : ""
                }`}
              >
                <FaFileInvoiceDollar className={styles.icon} />
                {!isCollapsed && "Pagamentos Para O Mês"}
              </li>

              <li
                onClick={() => navigate("/pagamentosatrasados")}
                className={`${styles.menuLi} ${
                  isActive("/pagamentosatrasados") ? styles.active : ""
                }`}
              >
                <FaClock className={styles.icon} />
                {!isCollapsed && "Pagamentos Atrasados"}
              </li>

              <li
                onClick={() => navigate("/emprestimospagos")}
                className={`${styles.menuLi} ${
                  isActive("/emprestimospagos") ? styles.active : ""
                }`}
              >
                <FaCheckCircle className={styles.icon} />
                {!isCollapsed && "Empréstimos Pagos"}
              </li>

              <li
                onClick={() => navigate("/suporte")}
                className={`${styles.menuLi} ${
                  isActive("/suporte") ? styles.active : ""
                }`}
              >
                <FaHeadset className={styles.icon} />
                {!isCollapsed && "Suporte"}
              </li>

              <li
                onClick={() => navigate("/perfil")}
                className={`${styles.menuLi} ${
                  isActive("/perfil") ? styles.active : ""
                }`}
              >
                <FaUserCircle className={styles.icon} />
                {!isCollapsed && "Perfil"}
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      <header
        className={`${styles.headerTop} ${
          isCollapsed ? styles.headerCollapsed : ""
        }`}
      >
        {pageTitle}
      </header>

      <main className={styles.pageContent}>{children}</main>
    </>
  );
}

export default MenuUsers;
