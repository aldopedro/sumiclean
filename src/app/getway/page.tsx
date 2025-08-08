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

            alert("Agendamento feito com sucesso!");
            router.push("/getway/pagamento");
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar o agendamento.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.main}>

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
