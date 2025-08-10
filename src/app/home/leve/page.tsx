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
            limpeza: "Pesada",
            tipo: tipos[tipoSelecionado],
            banheiros,
            quartos,
        }));
        console.log(dados);
        router.push("/getway");
    }
    function handleBackClick() {
        window.location.href = "/home";
    }
    return (
        <div className={styles.main}>
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
            <div className={styles.background}></div>
            <div className={styles.container}>
                <h3 className={styles.title}>COMO É SEU LAR?</h3>
                <span className={styles.subtitle}>clique no tipo de lar e quantidade de cômodos!</span>

                {/* Tipos */}
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

                {/* Contador Banheiros */}
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

                {/* Contador Quartos */}
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
                <input
                    type="text"
                    placeholder="Qual material do seu piso?"
                    className={styles.inputText}
                />
                <div className={styles.extraOptions}>
                    <label className={styles.switch}>
                        <input type="checkbox" />
                        <span className={styles.slider}></span>
                        <span className={styles.switchText}>Possui vidraças ou varanda</span>
                    </label>

                    <label className={styles.switch}>
                        <input type="checkbox" />
                        <span className={styles.slider}></span>
                        <span className={styles.switchText}>Possui móveis de madeira</span>
                    </label>
                </div>

                <button className={styles.buttonSubmit} onClick={handleSubmit}>Próximo</button>
            </div>
        </div>
    )
}
