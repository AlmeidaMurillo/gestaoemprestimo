import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API_URL from "./api";

export default function ProtectedRoute({ children }) {
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token")?.trim();
      console.log("Token do localStorage:", token);

      if (!token) {
        setAutorizado(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/validar-token`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Status da resposta:", res.status);

        const data = await res.json();
        console.log("Resposta do backend:", data);

        setAutorizado(data.valido);
        if (!data.valido) {
          console.warn("Token inválido. Removendo...");
          localStorage.removeItem("token");
        }
      } catch (erro) {
        console.error("Erro na requisição:", erro);
        setAutorizado(false);
        localStorage.removeItem("token");
      }
    };

    validarToken();
  }, []);

  if (autorizado === null) {
    return <p>Validando sessão...</p>;
  }

  if (!autorizado) {
    return <Navigate to="/" replace />;
  }
  return children;
}
