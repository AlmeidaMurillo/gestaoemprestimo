import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Perfil.module.css";
import {
  FaCamera,
  FaKey,
  FaUserEdit,
  FaBuilding,
  FaExchangeAlt,
  FaSignOutAlt,
  FaUser,
  FaTimes,
} from "react-icons/fa";

function Perfil({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
  const [mostrarModalPlano, setMostrarModalPlano] = useState(false);
  const [mostrarModalDados, setMostrarModalDados] = useState(false);
  const [mostrarModalEmpresa, setMostrarModalEmpresa] = useState(false);
  const [mostrarModalFoto, setMostrarModalFoto] = useState(false);

  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "Murillo Almeida",
    email: "almeidamurillo196@gmail.com",
    telefone: "(11) 91234-5678",
    cpf: "123.456.789-00",
    permissao: "Administrador",
    fotoPerfil: "",
  });

  const [dadosEmpresa, setDadosEmpresa] = useState({
    nome: "Almeida Finanças LTDA",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua Exemplo, 123, São Paulo - SP",
  });

  const [dadosPlano, setDadosPlano] = useState({
    nome: "Mensal - R$99,90",
    vencimento: "16/08/2025",
  });

  const [statusConta, setStatusConta] = useState("Ativo");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDadosUsuario({ ...dadosUsuario, fotoPerfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderModais = () => (
    <>
      {mostrarModalSenha && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Alterar Senha</h2>
            <input type="password" placeholder="Senha atual" className={styles.modalInput} />
            <input type="password" placeholder="Nova senha" className={styles.modalInput} />
            <input type="password" placeholder="Confirmar senha" className={styles.modalInput} />
            <div className={styles.modalButtons}>
              <button className={styles.btn}>Salvar</button>
              <button className={styles.btnCancel} onClick={() => setMostrarModalSenha(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {mostrarModalPlano && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Alterar Plano</h2>
            <select className={styles.modalInput}>
              <option value="mensal">Mensal - R$99,90</option>
              <option value="trimestral">Trimestral - R$269,90</option>
              <option value="anual">Anual - R$999,90</option>
            </select>
            <div className={styles.modalButtons}>
              <button className={styles.btn}>Salvar</button>
              <button className={styles.btnCancel} onClick={() => setMostrarModalPlano(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {mostrarModalDados && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Dados</h2>
            <input type="text" className={styles.modalInput} placeholder="Nome" defaultValue={dadosUsuario.nome} />
            <input type="email" className={styles.modalInput} placeholder="Email" defaultValue={dadosUsuario.email} />
            <input type="text" className={styles.modalInput} placeholder="Telefone" defaultValue={dadosUsuario.telefone} />
            <input type="text" className={styles.modalInput} placeholder="CPF" defaultValue={dadosUsuario.cpf} />
            <div className={styles.modalButtons}>
              <button className={styles.btn}>Salvar</button>
              <button className={styles.btnCancel} onClick={() => setMostrarModalDados(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {mostrarModalEmpresa && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Empresa</h2>
            <input type="text" className={styles.modalInput} placeholder="Nome da Empresa" defaultValue={dadosEmpresa.nome} />
            <input type="text" className={styles.modalInput} placeholder="CNPJ" defaultValue={dadosEmpresa.cnpj} />
            <input type="text" className={styles.modalInput} placeholder="Endereço" defaultValue={dadosEmpresa.endereco} />
            <div className={styles.modalButtons}>
              <button className={styles.btn}>Salvar</button>
              <button className={styles.btnCancel} onClick={() => setMostrarModalEmpresa(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {mostrarModalFoto && (
        <div className={styles.modalOverlay} onClick={() => setMostrarModalFoto(false)}>
          <div className={styles.modalContentFoto} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setMostrarModalFoto(false)}>
              <FaTimes />
            </button>
            {dadosUsuario.fotoPerfil ? (
              <img src={dadosUsuario.fotoPerfil} alt="Foto Ampliada" className={styles.fotoAmpliada} />
            ) : (
              <FaUser className={styles.userIconGrande} />
            )}
          </div>
        </div>
      )}
    </>
  );

  const conteudo = (
    <div className={styles.perfilContainer}>
      <div className={styles.leftPanel}>
        <div className={styles.fotoPerfil} onClick={() => setMostrarModalFoto(true)} tabIndex={0} role="button" aria-label="Abrir foto do perfil">
          {dadosUsuario.fotoPerfil ? (
            <img src={dadosUsuario.fotoPerfil} alt="Foto de Perfil" />
          ) : (
            <FaUser className={styles.userIcon} />
          )}
        </div>
        <label className={styles.uploadLabel}>
          <input type="file" accept="image/*" onChange={handleFotoChange} />
          <FaCamera className={styles.icon} /> Alterar Foto de Perfil
        </label>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={() => setMostrarModalSenha(true)}>
            <FaKey className={styles.icon} /> Alterar Senha
          </button>
          <button className={styles.btn} onClick={() => setMostrarModalPlano(true)}>
            <FaExchangeAlt className={styles.icon} /> Alterar Plano
          </button>
          <button className={styles.btn} onClick={() => setMostrarModalDados(true)}>
            <FaUserEdit className={styles.icon} /> Editar Dados
          </button>
          <button className={styles.btn} onClick={() => setMostrarModalEmpresa(true)}>
            <FaBuilding className={styles.icon} /> Editar Empresa
          </button>
          <button className={styles.btnCancel} onClick={() => (window.location.href = "/logout")}>
            <FaSignOutAlt className={styles.icon} /> Sair
          </button>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <section className={styles.infoQuadrante}>
          <h3>Dados Pessoais</h3>
          <div className={styles.infoCard}><strong>Nome:</strong> {dadosUsuario.nome}</div>
          <div className={styles.infoCard}><strong>Email:</strong> {dadosUsuario.email}</div>
          <div className={styles.infoCard}><strong>Telefone:</strong> {dadosUsuario.telefone}</div>
          <div className={styles.infoCard}><strong>CPF:</strong> {dadosUsuario.cpf}</div>
        </section>

        <section className={styles.infoQuadrante}>
          <h3>Empresa</h3>
          <div className={styles.infoCard}><strong>Empresa:</strong> {dadosEmpresa.nome}</div>
          <div className={styles.infoCard}><strong>CNPJ:</strong> {dadosEmpresa.cnpj}</div>
          <div className={styles.infoCard}><strong>Endereço:</strong> {dadosEmpresa.endereco}</div>
        </section>

        <section className={styles.infoQuadrante}>
          <h3>Plano</h3>
          <div className={styles.infoCard}><strong>Plano:</strong> {dadosPlano.nome}</div>
          <div className={styles.infoCard}><strong>Vencimento:</strong> {dadosPlano.vencimento}</div>
        </section>

        <section className={styles.infoQuadrante}>
          <h3>Status</h3>
          <div className={`${styles.infoCard} ${statusConta === "Ativo" ? styles.statusAtivo : styles.statusInativo}`}>
            <strong>Status:</strong> {statusConta}
          </div>
        </section>

        <section className={styles.infoQuadrante}>
          <h3>Acesso</h3>
          <div className={styles.infoCard}><strong>Permissão:</strong> {dadosUsuario.permissao}</div>
        </section>
      </div>

      {renderModais()}
    </div>
  );

  if (tipoUsuario === "admin") {
    return (
      <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
        {conteudo}
      </MenuDonos>
    );
  } else if (tipoUsuario === "user") {
    return (
      <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
        {conteudo}
      </MenuUsers>
    );
  } else {
    return <p>Carregando...</p>;
  }
}

export default Perfil;
