import React, { useState, useEffect, useRef, memo, useCallback } from "react";
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
  FaBars,
  FaMoon,
  FaSun,
  FaDollarSign,
  FaBell,
} from "react-icons/fa";
import styles from "./MenuDonos.module.css";

const MenuItem = memo(function MenuItem({
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
}) {
  return (
    <li
      tabIndex={0}
      role="menuitem"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`${styles.menuLi} ${isActive ? styles.active : ""}`}
    >
      <span className={styles.icon}>{icon}</span>
      {!isCollapsed && <span className={styles.label}>{label}</span>}
    </li>
  );
});

function MenuDonos({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("menuCollapsed");
    return stored === "true";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.body.classList.remove("darkTheme", "lightTheme");
    document.body.classList.add(theme === "dark" ? "darkTheme" : "lightTheme");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const updateOverflow = () => {
      const needsScroll = sidebar.scrollHeight > sidebar.clientHeight;
      sidebar.style.overflowY = needsScroll ? "auto" : "hidden";
    };

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(sidebar);

    window.addEventListener("resize", updateOverflow);
    updateOverflow();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      } else {
        const stored = localStorage.getItem("menuCollapsed");
        setIsCollapsed(stored === "true");
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      localStorage.setItem("menuCollapsed", !prev);
      return !prev;
    });
  }, []);

  const isActive = useCallback(
    (path) => {
      if (path === "/emprestimos") {
        return (
          location.pathname === "/emprestimos" ||
          location.pathname === "/parcelas"
        );
      }
      return location.pathname === path;
    },
    [location.pathname]
  );

  const handleMenuItemClick = useCallback(
    (path) => {
      navigate(path);
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      }
    },
    [navigate]
  );

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaUser />, label: "Clientes", path: "/clientes" },
    { icon: <FaMoneyBillWave />, label: "Empréstimos", path: "/emprestimos" },
    { icon: <FaChartBar />, label: "Pagamentos Para Hoje", path: "/pagarhoje" },
    {
      icon: <FaFileInvoiceDollar />,
      label: "Pagamentos Para O Mês",
      path: "/pagarmes",
    },
    {
      icon: <FaClock />,
      label: "Pagamentos Atrasados",
      path: "/pagamentosatrasados",
    },
    {
      icon: <FaCheckCircle />,
      label: "Empréstimos Pagos",
      path: "/emprestimospagos",
    },
    { icon: <FaCog />, label: "Configurações", path: "/configuracoes" },
    { icon: <FaHeadset />, label: "Suporte", path: "/suporte" },
    { icon: <FaUserCircle />, label: "Perfil", path: "/perfil" },
  ];

  return (
    <>
      <header className={styles.headerTop}>
        <button
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-navigation"
        >
          <FaBars />
        </button>

        <div className={styles.logoContainer}>
          <div className={styles.logo}>MultiAlmeida</div>
          <h2 className={styles.subtitle}>Gestão De Empréstimos</h2>
        </div>

        <div className={styles.iconsContainer}>
          <button className={styles.iconButton} onClick={toggleTheme}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <div className={styles.iconWrapper}>
            <FaDollarSign />
            <span className={`${styles.badge} ${styles.red}`}>0</span>
          </div>

          <div className={styles.iconWrapper}>
            <FaBell />
            <span className={`${styles.badge} ${styles.black}`}>0</span>
          </div>

          <div className={styles.profileCircle}>
            <FaUser size={20} />
          </div>
        </div>
      </header>

      <div
        className={`${styles.container} ${isCollapsed ? styles.collapsed : ""}`}
      >
        <aside
          className={styles.sidebar}
          ref={sidebarRef}
          id="sidebar-navigation"
          role="navigation"
          aria-label="Menu principal"
        >
          <nav>
            <ul className={styles.menuUl} role="menu">
              {menuItems.map(({ icon, label, path }) => (
                <MenuItem
                  key={path}
                  icon={icon}
                  label={label}
                  isCollapsed={isCollapsed}
                  isActive={isActive(path)}
                  onClick={() => handleMenuItemClick(path)}
                />
              ))}
            </ul>
          </nav>
        </aside>

        <main className={styles.pageContent}>{children}</main>
      </div>
    </>
  );
}

export default MenuDonos;
