'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AgendamentoDataHora() {
    const router = useRouter();
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmitFinal() {
        if (!data || !hora) {
            alert("Preencha data e hora.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const agendamento = JSON.parse(localStorage.getItem("agendamento") || "{}");

        const dadosCompletos = {
            ...agendamento,
            clienteId: user.id,
            data,
            hora
        };

        try {
            setLoading(true);
            const response = await fetch("https://sumiclean-q7p6.onrender.com/agendamento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(dadosCompletos),
            });

            if (!response.ok) throw new Error("Erro ao enviar agendamento");
            router.push("/getway/pagamento");
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar agendamento");
        } finally {
            setLoading(false);
        }
    }

    function handleBackClick() {
        router.push("/home");
    }

    return (
        <div className={styles.main}>
            <div className={styles.backContainer}>
                <button onClick={handleBackClick} className={styles.backButton} type="button" aria-label="Voltar">
                    <svg className={styles.backArrow} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className={styles.container}>
                <h2 className={styles.title}>Escolha a data e hora</h2>

                <div className={styles.field}>
                    <label className={styles.label}>Data desejada:</label>
                    <input type="date" value={data} onChange={e => setData(e.target.value)} className={styles.input} />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Hora desejada:</label>
                    <input type="time" value={hora} onChange={e => setHora(e.target.value)} className={styles.input} />
                </div>

                <button onClick={handleSubmitFinal} disabled={loading} className={styles.button}>
                    {loading ? "Enviando..." : "Próximo"}
                </button>
            </div>
        </div>
    );
}
