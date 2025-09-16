import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/Scroll/ScrollToTop";
import Spinner from "../components/Spinner/Spinner";
// NAO ESQUECER DE DEIXAAR MEU SISTEMA TOTALMENTE RESPONSIVO DESDE COMPONENTES ATÉ TELAS
// ARRUMAR OS ICONES DOS MENU COM A RESPONSIVIDADE PARA CELULARES, E MEXER NO SCROLL DE ROLAGEM PARA FUNCIONAR DO MESMO JEITO PARA TODOS OS DISPOSITIVOS
const Login = lazy(() => import("./Telas/TelaLogin/Login"));
const Dashboard = lazy(() => import("./Telas/TelaDashboard/Dashboard"));
const Clientes = lazy(() => import("./Telas/TelaClientes/Clientes"));
const Emprestimos = lazy(() => import("./Telas/TelaEmpréstimos/Emprestimos"));
const ParcelasEmprestimos = lazy(() => import("./Telas/TelaParcelas/Parcelas"));
const PagarHoje = lazy(() =>
  import("./Telas/TelaPagamentosParaHoje/PagarHoje")
);
const PagarMes = lazy(() => import("./Telas/TelaPagamentosParaMes/PagarMes"));
const PagamentosAtrasados = lazy(() =>
  import("./Telas/TelaPagamentosAtrasados/PagamentosAtrasados")
);
const EmprestimosPagos = lazy(() =>
  import("./Telas/TelaEmpréstimosPagos/EmprestimosPagos")
);
const Configuracoes = lazy(() =>
  import("./Telas/TelaConfiguracoes/Configuracoes")
);
const Suporte = lazy(() => import("./Telas/TelaSuporte/Suporte"));
const Perfil = lazy(() => import("./Telas/TelaPerfil/Perfil"));

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/clientes"
            element={
              <Clientes
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/emprestimos"
            element={
              <Emprestimos
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/pagarhoje"
            element={
              <PagarHoje
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/pagarmes"
            element={
              <PagarMes
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/pagamentosatrasados"
            element={
              <PagamentosAtrasados
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/emprestimospagos"
            element={
              <EmprestimosPagos
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/configuracoes"
            element={
              <Configuracoes
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/suporte"
            element={
              <Suporte
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/perfil"
            element={
              <Perfil isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            }
          />
          <Route
            path="/parcelas"
            element={
              <ParcelasEmprestimos
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
