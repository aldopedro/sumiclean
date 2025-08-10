'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAgendamento } from "../context/contextApi";
import styles from "./page.module.css";

export default function CadastroEndereco() {
    const { dados } = useAgendamento();
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");
    const [numero, setNumero] = useState("");
    const [referencia, setReferencia] = useState("");
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmitFinal() {
        if (!nome || !endereco || !numero) {
            alert("Por favor, preencha nome, endereço e número.");
            return;
        }

        const dadosCompletos = {
            ...dados,
            nome,
            endereco,
            numero,
            referencia,
            data,
            hora,
        };

        try {
            setLoading(true);
            const response = await fetch("https://sumiclean-q7p6.onrender.com/agendamento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosCompletos),
            });

            if (!response.ok) throw new Error("Erro ao agendar.");
            router.push("/getway/pagamento");
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar o agendamento.");
        } finally {
            setLoading(false);
        }
    }
    function handleBackClick() {
        window.location.href = "/home";
    }
    return (
        <div className={styles.main}>
            <div className={styles.background}></div>
      <div className={styles.backContainer}>
        <button
          onClick={handleBackClick}
          className={styles.backButton}
          type="button"
          aria-label="Voltar"
        >
          <svg
            className={styles.backArrow}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
            <div className={styles.container}>
                <h2 className={styles.title}>Informações de contato</h2>

                <div className={styles.field}>
                    <label className={styles.label}>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Endereço (rua):</label>
                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Número:</label>
                    <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Ponto de referência:</label>
                    <input
                        type="text"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Data que deseja: </label>
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Hora que deseja: </label>
                    <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <button
                    onClick={handleSubmitFinal}
                    disabled={loading}
                    className={styles.button}
                >
                    {loading ? "Enviando..." : "Proximo"}
                </button>
            </div>
        </div>
    );
}
