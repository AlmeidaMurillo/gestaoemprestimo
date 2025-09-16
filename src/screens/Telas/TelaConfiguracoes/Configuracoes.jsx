import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Configuracoes.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Configuracoes({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalVisualizacaoAberto, setModalVisualizacaoAberto] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [novoFuncionario, setNovoFuncionario] = useState({
    id: null,
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cargo: "",
    permissao: "comum",
  });
  const [configuracoes, setConfiguracoes] = useState([
    {
      id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 99999-9999",
      cargo: "Gerente",
      permissao: "admin",
    },
    {
      id: 2,
      nome: "Ana Oliveira DA SILVA DIAS DE ALMEIDA",
      email: "ana@email.com",
      telefone: "(11) 98888-8888",
      cargo: "Vendedora",
      permissao: "comum",
    },
  ]);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
  }, []);

  const abrirModalNovo = () => {
    setNovoFuncionario({
      id: null,
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      cargo: "",
      permissao: "comum",
    });
    setMostrarSenha(false);
    setModalNovoAberto(true);
  };

  const abrirModalEditar = (funcionario) => {
    setNovoFuncionario(funcionario);
    setMostrarSenha(false);
    setModalEditarAberto(true);
  };

  const fecharModalNovo = () => setModalNovoAberto(false);
  const fecharModalVisualizacao = () => {
    setFuncionarioSelecionado(null);
    setModalVisualizacaoAberto(false);
  };
  const abrirModalVisualizacao = (func) => {
    setFuncionarioSelecionado(func);
    setModalVisualizacaoAberto(true);
  };
  const fecharModalSenha = () => setModalSenhaAberto(false);

  const abrirModalSenha = () => {
    setSenhaNova("");
    setMostrarSenha(false);
    setModalSenhaAberto(true);
  };

  const salvarFuncionario = (e) => {
    e.preventDefault();
    if (!novoFuncionario.nome.trim()) return;
    if (novoFuncionario.id === null) {
      const novoId = configuracoes.length
        ? Math.max(...configuracoes.map((c) => c.id)) + 1
        : 1;
      setConfiguracoes((prev) => [...prev, { ...novoFuncionario, id: novoId }]);
    } else {
      setConfiguracoes((prev) =>
        prev.map((f) =>
          f.id === novoFuncionario.id ? { ...novoFuncionario } : f
        )
      );
    }
    setModalNovoAberto(false);
    setModalEditarAberto(false);
  };

  const salvarSenha = (e) => {
    e.preventDefault();
    if (!senhaNova.trim()) return;
    alert(`Senha alterada para: ${senhaNova}`);
    setModalSenhaAberto(false);
  };

  const excluirFuncionario = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o funcionário ${funcionarioSelecionado.nome}?`
      )
    ) {
      setConfiguracoes((prev) =>
        prev.filter((f) => f.id !== funcionarioSelecionado.id)
      );
      setModalVisualizacaoAberto(false);
    }
  };

  const handleChangeNovoFuncionario = (e) => {
    const { name, value } = e.target;
    setNovoFuncionario((prev) => ({ ...prev, [name]: value }));
  };

  const filteredConfiguracoes = configuracoes.filter(
    (func) =>
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.id.toString().includes(searchTerm)
  );

  return (
    <>
      {tipoUsuario === "admin" ? (
        <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          <div className={styles.container}>
            <div className={styles.filtros}>
              <input
                type="text"
                placeholder="Pesquisar por nome ou ID..."
                className={styles.inputBusca}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.botaoNovo} onClick={abrirModalNovo}>
                + Novo Funcionário
              </button>
            </div>
            <p className={styles.avisocliente}>
              👆 Clique No Card Do Funcionário Para Ver Mais Informações Do Funcionário.
            </p>
            <div className={styles.tabelaWrapper}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Funcionário</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConfiguracoes.length > 0 ? (
                    filteredConfiguracoes.map((func) => (
                      <tr
                        key={func.id}
                        className={styles.tabelaRow}
                        onClick={() => abrirModalVisualizacao(func)}
                      >
                        <td>{func.id}</td>
                        <td className={styles.clienteClicavel}>👁️ {func.nome}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={styles.notFound}>
                        Nenhum funcionario encontrado com este nome ou id.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {modalNovoAberto && (
              <div
                className={styles.modalOverlay}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className={styles.modalTitle}>Novo Funcionário</h2>
                  <form
                    onSubmit={salvarFuncionario}
                    className={styles.formModal}
                  >
                    <label>
                      Nome completo:
                      <input
                        type="text"
                        name="nome"
                        placeholder="Ex: João da Silva"
                        value={novoFuncionario.nome}
                        onChange={handleChangeNovoFuncionario}
                        required
                      />
                    </label>
                    <label>
                      Email:
                      <input
                        type="email"
                        name="email"
                        placeholder="Ex: exemplo@gmail.com"
                        value={novoFuncionario.email}
                        onChange={handleChangeNovoFuncionario}
                      />
                    </label>
                    <label className={styles.senhaLabel}>
                      Senha:
                      <div className={styles.inputSenhaWrapper}>
                        <input
                          type={mostrarSenha ? "text" : "password"}
                          name="senha"
                          placeholder="Digite a senha do funcionário"
                          value={novoFuncionario.senha}
                          onChange={handleChangeNovoFuncionario}
                        />
                        <button
                          type="button"
                          className={styles.toggleSenha}
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                          {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </label>
                    <label>
                      Telefone:
                      <input
                        type="tel"
                        name="telefone"
                        placeholder="Ex: (11) 91234-5678"
                        value={novoFuncionario.telefone}
                        onChange={handleChangeNovoFuncionario}
                      />
                    </label>
                    <label>
                      Cargo:
                      <input
                        type="text"
                        name="cargo"
                        placeholder="Ex: Gerente, Vendedor"
                        value={novoFuncionario.cargo}
                        onChange={handleChangeNovoFuncionario}
                      />
                    </label>
                    <label>
                      Permissão:
                      <select
                        name="permissao"
                        value={novoFuncionario.permissao}
                        onChange={handleChangeNovoFuncionario}
                      >
                        <option value="comum">Comum</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </label>
                    <div className={styles.botoesModal}>
                      <button type="submit" className={styles.botaoSalvar}>
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={fecharModalNovo}
                        className={styles.botaoCancelar}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {modalEditarAberto && (
              <div
                className={styles.modalOverlay}
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 10000 }}
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className={styles.modalTitle}>Editar Funcionário</h2>
                  <form
                    onSubmit={salvarFuncionario}
                    className={styles.formModal}
                  >
                    <label>
                      Nome completo:
                      <input
                        type="text"
                        name="nome"
                        value={novoFuncionario.nome}
                        onChange={handleChangeNovoFuncionario}
                        required
                      />
                    </label>
                    <label>
                      Email:
                      <input
                        type="email"
                        name="email"
                        value={novoFuncionario.email}
                        onChange={handleChangeNovoFuncionario}
                      />
                    </label>
                    <label>
                      Telefone:
                      <input
                        type="tel"
                        name="telefone"
                        value={novoFuncionario.telefone}
                        onChange={handleChangeNovoFuncionario}
                      />
                    </label>
                    <label>
                      Cargo:
                      <input
                        type="text"
                        name="cargo"
                        value={novoFuncionario.cargo}
                        onChange={handleChangeNovoFuncionario}
                      />
                    </label>
                    <label>
                      Permissão:
                      <select
                        name="permissao"
                        value={novoFuncionario.permissao}
                        onChange={handleChangeNovoFuncionario}
                      >
                        <option value="comum">Comum</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </label>
                    <div className={styles.botoesModal}>
                      <button type="submit" className={styles.botaoSalvar}>
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalEditarAberto(false)}
                        className={styles.botaoCancelar}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {modalVisualizacaoAberto && funcionarioSelecionado && (
              <div
                className={styles.modalOverlay}
                role="dialog"
                aria-modal="true"
                style={{ zIndex: 9999 }}
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                  style={{ maxWidth: 520, position: "relative" }}
                >
                  <button
                    onClick={fecharModalVisualizacao}
                    className={styles.closeButton}
                    aria-label="Fechar modal"
                  >
                    ×
                  </button>
                  <h2 className={styles.modalTitlevisualização}>
                    Detalhes do Funcionário
                  </h2>
                  <div className={styles.infoContainer}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>ID:</span>
                      <span className={styles.value}>
                        {funcionarioSelecionado.id}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Nome:</span>
                      <span className={styles.value}>
                        {funcionarioSelecionado.nome}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Email:</span>
                      <span className={styles.value}>
                        {funcionarioSelecionado.email || "-"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Telefone:</span>
                      <span className={styles.value}>
                        {funcionarioSelecionado.telefone || "-"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Cargo:</span>
                      <span className={styles.value}>
                        {funcionarioSelecionado.cargo || "-"}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Permissão:</span>
                      <span className={styles.value}>
                        {funcionarioSelecionado.permissao === "admin"
                          ? "Administrador"
                          : "Comum"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={styles.botoesModal}
                    style={{ justifyContent: "space-between" }}
                  >
                    <button
                      className={styles.botaoEditar}
                      onClick={() => {
                        abrirModalEditar(funcionarioSelecionado);
                      }}
                    >
                      Editar Dados
                    </button>
                    <button
                      className={styles.botaoSalvar}
                      onClick={abrirModalSenha}
                    >
                      Trocar Senha
                    </button>
                    <button
                      className={styles.botaoExcluir}
                      onClick={excluirFuncionario}
                    >
                      Excluir Funcionário
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modalSenhaAberto && (
              <div
                className={styles.modalOverlay}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                  style={{ maxWidth: 400 }}
                >
                  <h2 className={styles.modalTitle}>Alterar Senha</h2>
                  <form onSubmit={salvarSenha} className={styles.formModal}>
                    <label className={styles.senhaLabel}>
                      Nova Senha:
                      <div className={styles.inputSenhaWrapper}>
                        <input
                          type={mostrarSenha ? "text" : "password"}
                          value={senhaNova}
                          onChange={(e) => setSenhaNova(e.target.value)}
                          placeholder="Digite a nova senha"
                          required
                        />
                        <button
                          type="button"
                          className={styles.toggleSenha}
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                          {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </label>
                    <label className={styles.senhaLabel}>
                      Confirmar Senha:
                      <div className={styles.inputSenhaWrapper}>
                        <input
                          type={mostrarSenha ? "text" : "password"}
                          value={senhaConfirmacao}
                          onChange={(e) => setSenhaConfirmacao(e.target.value)}
                          placeholder="Digite novamente a nova senha"
                          required
                        />
                        <button
                          type="button"
                          className={styles.toggleSenha}
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                          {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </label>
                    <div className={styles.botoesModal}>
                      <button type="submit" className={styles.botaoSalvar}>
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={fecharModalSenha}
                        className={styles.botaoCancelar}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </MenuDonos>
      ) : tipoUsuario === "user" ? (
        <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          <p>Você não tem permissão para acessar essa página.</p>
        </MenuUsers>
      ) : (
        <p>Carregando...</p>
      )}
    </>
  );
}

export default Configuracoes;
