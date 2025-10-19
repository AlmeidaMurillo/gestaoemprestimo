import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/Scroll/ScrollToTop";
import Spinner from "../components/Spinner/Spinner";
import ProtectedRoute from "../ProtectedRoute";

const Login = lazy(() => import("./Telas/TelaLogin/Login"));
const Dashboard = lazy(() => import("./Telas/TelaDashboard/Dashboard"));
const Clientes = lazy(() => import("./Telas/TelaClientes/Clientes"));
const Emprestimos = lazy(() => import("./Telas/TelaEmpréstimos/Emprestimos"));
const ParcelasEmprestimos = lazy(() => import("./Telas/TelaParcelas/Parcelas"));
const PagarHoje = lazy(() => import("./Telas/TelaPagamentosParaHoje/PagarHoje"));
const PagarMes = lazy(() => import("./Telas/TelaPagamentosParaMes/PagarMes"));
const PagamentosAtrasados = lazy(() => import("./Telas/TelaPagamentosAtrasados/PagamentosAtrasados"));
const EmprestimosPagos = lazy(() => import("./Telas/TelaEmpréstimosPagos/EmprestimosPagos"));
const Suporte = lazy(() => import("./Telas/TelaSuporte/Suporte"));
const Perfil = lazy(() => import("./Telas/TelaPerfil/Perfil"));

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const protectedProps = { isCollapsed, toggleSidebar };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard {...protectedProps} /></ProtectedRoute>} />
          <Route path="/clientes" element={<ProtectedRoute><Clientes {...protectedProps} /></ProtectedRoute>} />
          <Route path="/emprestimos" element={<ProtectedRoute><Emprestimos {...protectedProps} /></ProtectedRoute>} />
          <Route path="/parcelas" element={<ProtectedRoute><ParcelasEmprestimos {...protectedProps} /></ProtectedRoute>} />
          <Route path="/pagarhoje" element={<ProtectedRoute><PagarHoje {...protectedProps} /></ProtectedRoute>} />
          <Route path="/pagarmes" element={<ProtectedRoute><PagarMes {...protectedProps} /></ProtectedRoute>} />
          <Route path="/pagamentosatrasados" element={<ProtectedRoute><PagamentosAtrasados {...protectedProps} /></ProtectedRoute>} />
          <Route path="/emprestimospagos" element={<ProtectedRoute><EmprestimosPagos {...protectedProps} /></ProtectedRoute>} />
          <Route path="/suporte" element={<ProtectedRoute><Suporte {...protectedProps} /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil {...protectedProps} /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
