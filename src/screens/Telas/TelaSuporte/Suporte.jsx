import React, { useEffect, useState } from "react";
import MenuDonos from "../../../components/MenuDonos/MenuDonos";
import MenuUsers from "../../../components/MenuUsers/MenuUsers";
import styles from "./Suporte.module.css";

const ConteudoSuporte = ({
  assunto,
  setAssunto,
  mensagem,
  setMensagem,
  enviando,
  feedback,
  enviarSolicitacao,
  chamados,
  abrirModal,
  tipoUsuario,
}) => (
  <main className={styles.container} role="main" aria-labelledby="titulo-suporte">
    <h1 id="titulo-suporte" className={styles.title}>Central de Suporte</h1>

    <section className={styles.supportSection} aria-label="Formulário de contato">
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          enviarSolicitacao();
        }}
        noValidate
      >
        <div className={styles.fieldGroup}>
          <label htmlFor="assunto" className={styles.label}>Assunto</label>
          <input
            id="assunto"
            type="text"
            className={styles.input}
            placeholder="Informe o assunto da sua dúvida"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            disabled={enviando}
            required
            aria-required="true"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="mensagem" className={styles.label}>Mensagem</label>
          <textarea
            id="mensagem"
            className={styles.textarea}
            placeholder="Descreva seu problema ou dúvida detalhadamente"
            rows={6}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            disabled={enviando}
            required
            aria-required="true"
          />
        </div>
        {feedback && (
          <div className={feedback.tipo === "erro" ? styles.feedbackError : styles.feedbackSuccess}>
            {feedback.texto}
          </div>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar Solicitação"}
        </button>
      </form>
    </section>

    <section className={styles.historySection} aria-label="Histórico de chamados">
      <h2 className={styles.subtitle}>Chamados Pendentes</h2>
      <ul className={styles.ticketList}>
        {chamados.filter(c => c.status === "Pendente").map((chamado) => (
          <li
            key={chamado.id}
            className={styles.ticketCard}
            onClick={() => abrirModal(chamado)}
            style={{ cursor: "pointer" }}
          >
            <header className={styles.ticketHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <small style={{ fontWeight: "600", color: "var(--text-color)" }}>
                  {chamado.atendente ? `Atendente: ${chamado.atendente}` : "Atendente: —"}
                </small>
                <span className={styles.ticketId}># {chamado.id}</span>
              </div>
              <span className={styles.statusPending}>{chamado.status}</span>
            </header>
            <p className={styles.ticketMessage}>“{chamado.mensagem}”</p>
            <p style={{ fontSize: "0.8rem", fontStyle: "italic", color: "var(--text-color)", opacity: 0.7 }}>
              Assunto: {chamado.assunto}
            </p>
          </li>
        ))}
      </ul>

      <h2 className={styles.subtitle}>Chamados Respondidos</h2>
      <ul className={styles.ticketList}>
        {chamados.filter(c => c.status === "Em análise").map((chamado) => (
          <li
            key={chamado.id}
            className={styles.ticketCard}
            onClick={() => abrirModal(chamado)}
            style={{ cursor: "pointer" }}
          >
            <header className={styles.ticketHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <small style={{ fontWeight: "600", color: "var(--text-color)" }}>
                  {chamado.atendente ? `Atendente: ${chamado.atendente}` : "Atendente: —"}
                </small>
                <span className={styles.ticketId}># {chamado.id}</span>
              </div>
              <span className={styles.statusInReview}>{chamado.status}</span>
            </header>
            <p className={styles.ticketMessage}>“{chamado.mensagem}”</p>
            <p style={{ fontSize: "0.8rem", fontStyle: "italic", color: "var(--text-color)", opacity: 0.7 }}>
              Assunto: {chamado.assunto}
            </p>
          </li>
        ))}
      </ul>

      <h2 className={styles.subtitle}>Chamados Resolvidos</h2>
      <ul className={styles.ticketList}>
        {chamados.filter(c => c.status === "Resolvido").map((chamado) => (
          <li
            key={chamado.id}
            className={styles.ticketCard}
            onClick={() => abrirModal(chamado)}
            style={{ cursor: "pointer" }}
          >
            <header className={styles.ticketHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <small style={{ fontWeight: "600", color: "var(--text-color)" }}>
                  {chamado.atendente ? `Atendente: ${chamado.atendente}` : "Atendente: —"}
                </small>
                <span className={styles.ticketId}># {chamado.id}</span>
              </div>
              <span className={styles.statusResolved}>{chamado.status}</span>
            </header>
            <p className={styles.ticketMessage}>“{chamado.mensagem}”</p>
            <p style={{ fontSize: "0.8rem", fontStyle: "italic", color: "var(--text-color)", opacity: 0.7 }}>
              Assunto: {chamado.assunto}
            </p>
          </li>
        ))}
      </ul>
    </section>
  </main>
);

function Suporte({ isCollapsed, toggleSidebar }) {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState("");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    if (!tipo) {
      window.location.href = "/";
    } else {
      setTipoUsuario(tipo);
    }
  }, []);

  const chamados = [
    {
      id: 1023,
      status: "Em análise",
      assunto: "Área de clientes",
      data: "20/07/2025",
      atendente: "João Silva",
      mensagem: "Não consigo acessar a área de clientes.",
      mensagens: [
        { texto: "Não consigo acessar a área de clientes.", autor: "Cliente" },
        { texto: "Estamos verificando o problema.", autor: "Suporte" },
        { texto: "Ainda estamos analisando o caso.", autor: "Suporte" },
        { texto: "Você já tentou limpar o cache do navegador?", autor: "Suporte" }
      ],
    },
    {
      id: 1018,
      status: "Resolvido",
      assunto: "Alterar senha",
      data: "19/07/2025",
      atendente: "Maria Oliveira",
      mensagem: "Como alterar a senha?",
      mensagens: [
        { texto: "Como alterar a senha?", autor: "Cliente" },
        { texto: "Acesse o menu perfil e clique em 'Alterar senha'.", autor: "Suporte" }
      ],
    },
    {
      id: 1015,
      status: "Pendente",
      assunto: "Valor do boleto",
      data: "18/07/2025",
      atendente: null,
      mensagem: "O valor do boleto está incorreto.",
      mensagens: [
        { texto: "O valor do boleto está incorreto.", autor: "Cliente" }
      ],
    },
    {
      id: 1040,
      status: "Em análise",
      assunto: "Problema no login",
      data: "21/07/2025",
      atendente: "Lucas Pereira",
      mensagem: "Não consigo fazer login na conta.",
      mensagens: [
        { texto: "Não consigo fazer login na conta.", autor: "Cliente" },
        { texto: "Estamos investigando o problema.", autor: "Suporte" },
        { texto: "Por favor, informe se aparece alguma mensagem de erro.", autor: "Suporte" }
      ],
    },
    {
      id: 1050,
      status: "Em análise",
      assunto: "Erro no relatório",
      data: "22/07/2025",
      atendente: "Ana Costa",
      mensagem: "O relatório mensal está mostrando dados errados.",
      mensagens: [
        { texto: "O relatório mensal está mostrando dados errados.", autor: "Cliente" },
        { texto: "Nossa equipe já está ciente e está trabalhando nisso.", autor: "Suporte" },
        { texto: "Agradecemos pela paciência.", autor: "Suporte" }
      ],
    }
  ];

  const enviarSolicitacao = () => {
    if (!assunto.trim() || !mensagem.trim()) {
      setFeedback({ tipo: "erro", texto: "Por favor, preencha todos os campos." });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    setEnviando(true);
    setFeedback(null);
    setTimeout(() => {
      setEnviando(false);
      setAssunto("");
      setMensagem("");
      setFeedback({ tipo: "sucesso", texto: "Sua solicitação foi enviada com sucesso!" });
      setTimeout(() => setFeedback(null), 2000);
    }, 1500);
  };

  const abrirModal = (chamado) => {
    setChamadoSelecionado(chamado);
    setNovaMensagem("");
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setChamadoSelecionado(null);
    setNovaMensagem("");
  };

  const enviarNovaMensagem = () => {
    if (!novaMensagem.trim()) return;
    const newMsg = { texto: novaMensagem.trim(), autor: tipoUsuario === "admin" ? "Suporte" : "Cliente" };
    const updatedChamado = {
      ...chamadoSelecionado,
      mensagens: [...(chamadoSelecionado.mensagens || []), newMsg],
    };
    setChamadoSelecionado(updatedChamado);
    setNovaMensagem("");
  };

  const renderMenu = () => {
    const props = {
      assunto,
      setAssunto,
      mensagem,
      setMensagem,
      enviando,
      feedback,
      enviarSolicitacao,
      chamados,
      abrirModal,
      tipoUsuario,
    };
    if (tipoUsuario === "admin") {
      return (
        <MenuDonos isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          <ConteudoSuporte {...props} />
        </MenuDonos>
      );
    }
    if (tipoUsuario === "user") {
      return (
        <MenuUsers isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
          <ConteudoSuporte {...props} />
        </MenuUsers>
      );
    }
    return <p>Carregando...</p>;
  };

  return (
    <>
      {renderMenu()}
      {mostrarModal && chamadoSelecionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h3>Chamado #{chamadoSelecionado.id}</h3>
              <span
                className={
                  chamadoSelecionado.status === "Resolvido"
                    ? styles.statusResolved
                    : chamadoSelecionado.status === "Em análise"
                    ? styles.statusInReview
                    : styles.statusPending
                }
              >
                {chamadoSelecionado.status}
              </span>
            </header>

            <div className={styles.modalInfoContainer}>
              <p>
                <strong>Atendente:</strong> {chamadoSelecionado.atendente || "—"}
              </p>
              <p>
                <strong>Assunto:</strong> {chamadoSelecionado.assunto}
              </p>
              <p>
                <strong>Data:</strong> {chamadoSelecionado.data}
              </p>
            </div>

            <div className={styles.modalMensagensWrapper}>
              {chamadoSelecionado.mensagens.map((msg, idx) => (
                <p key={idx} className={styles.modalMensagem}>
                  <strong>{msg.autor === "Cliente" ? "Você" : msg.autor}:</strong> {msg.texto}
                </p>
              ))}
            </div>

            {chamadoSelecionado.status !== "Resolvido" && (
              <>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Adicionar uma nova mensagem..."
                  rows={4}
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                />
                <div className={styles.modalActions}>
                  <button className={styles.modalSendButton} onClick={enviarNovaMensagem}>
                    Enviar nova mensagem
                  </button>
                  <button onClick={fecharModal} className={styles.modalCloseButton}>
                    Fechar
                  </button>
                </div>
              </>
            )}

            {chamadoSelecionado.status === "Resolvido" && (
              <div className={styles.modalActions}>
                <button onClick={fecharModal} className={styles.modalCloseButton}>
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Suporte;
