'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useAgendamento } from "../context/contextApi";

export default function CadastroDataHora() {
  const { dados } = useAgendamento();
  const router = useRouter();

  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmitFinal() {
    if (!data || !hora) {
      alert("Por favor, selecione data e hora.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const dadosCompletos = {
      clienteId: user.id,
      ...dados,
      data,
      hora
    };

    try {
      setLoading(true);
      const response = await fetch("https://sumiclean-q7p6.onrender.com/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
        "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(dadosCompletos)
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
        <button onClick={handleBackClick} className={styles.backButton} type="button">
          <svg className={styles.backArrow} viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.container}>
        <h2 className={styles.title}>Escolha a data e hora</h2>

        <div className={styles.field}>
          <label className={styles.label}>Data:</label>
          <input type="date" value={data} onChange={e => setData(e.target.value)} className={styles.input}/>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Hora:</label>
          <input type="time" value={hora} onChange={e => setHora(e.target.value)} className={styles.input}/>
        </div>

        <button className={styles.button} onClick={handleSubmitFinal} disabled={loading}>
          {loading ? "Enviando..." : "Finalizar Agendamento"}
        </button>
      </div>
    </div>
  );
}
