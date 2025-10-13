import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAutorizado(false);
        return;
      }

      try {
        const res = await fetch("https://gback.cloudx.work/validar-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAutorizado(data.valido);
        if (!data.valido) localStorage.removeItem("token");
      } catch {
        setAutorizado(false);
        localStorage.removeItem("token");
      }
    };

    validarToken();
  }, []);

  if (autorizado === null) return <p>Validando sessão...</p>;
  if (!autorizado) return <Navigate to="/" replace />;

  return children;
}
