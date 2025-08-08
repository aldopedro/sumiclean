'use client'
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from './leve.module.css';
import { useAgendamento } from "../../context/contextApi";

const tipos = ["Studio", "Apartamento", "Casa"];

export default function Leve() {
   const router = useRouter()
    const [banheiros, setBanheiros] = useState(1);
    const [quartos, setQuartos] = useState(1);
    const [tipoSelecionado, setTipoSelecionado] = useState<number | null>(null);
const { dados, setDados } = useAgendamento();
function handleSubmit() {
  if (tipoSelecionado === null) return alert("Selecione o tipo");

  setDados(prev => ({
    ...prev,
    limpeza: "Leve",
    tipo: tipos[tipoSelecionado],
    banheiros,
    quartos,
  }));
  router.push("/getway");
}
    return (
        <div className={styles.main}>
            <div className={styles.background}></div>
            <div className={styles.container}>
                <h3 className={styles.title}>COMO É SEU LAR?</h3>
                <span className={styles.subtitle}>clique no tipo de lar e quantidade de cômodos!</span>
                <div className={styles.typeButtons}>
                    {tipos.map((tipo, idx) => (
                        <label key={tipo} className={styles.typeButton}>
                            <input
                                type="checkbox"
                                checked={tipoSelecionado === idx}
                                onChange={() => setTipoSelecionado(tipoSelecionado === idx ? null : idx)}
                                className={styles.checkboxInput}
                            />
                            <span>{tipo}</span>
                        </label>
                    ))}
                </div>
                <div className={styles.counter}>
                    <button
                        className={styles.counterButton}
                        onClick={() => setBanheiros(b => Math.max(1, b - 1))}
                    > - </button>
                    <span className={styles.counterLabel}>{banheiros} banheiro{banheiros > 1 ? "s" : ""}</span>
                    <button
                        className={styles.counterButton}
                        onClick={() => setBanheiros(b => b + 1)}
                    > + </button>
                </div>
                <div className={styles.counter}>
                    <button
                        className={styles.counterButton}
                        onClick={() => setQuartos(q => Math.max(1, q - 1))}
                    > - </button>
                    <span className={styles.counterLabel}>{quartos} quarto{quartos > 1 ? "s" : ""}</span>
                    <button
                        className={styles.counterButton}
                        onClick={() => setQuartos(q => q + 1)}
                    > + </button>
                </div>
                <span className={styles.infoText} >cozinha e sala já estão inclusos</span>
                <span className={styles.infoText}><br/>para lavabo adicione banheiros e para demais cômodos adicione mais quartos</span>
                <button className={styles.buttonSubmit} onClick={() => handleSubmit()}>Proximo</button>
            </div>
        </div>
    )
}