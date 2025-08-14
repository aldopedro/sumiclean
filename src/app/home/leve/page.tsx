'use client';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from './leve.module.css';
import { useAgendamento } from "../../context/contextApi";

const tipos = ["Studio", "Apartamento", "Casa"];

export default function Limpeza() {
  const router = useRouter();
  const { dados, setDados } = useAgendamento();

  const [banheiros, setBanheiros] = useState(1);
  const [quartos, setQuartos] = useState(1);
  const [tipoSelecionado, setTipoSelecionado] = useState<number | null>(null);
  const [temVidracas, setTemVidracas] = useState(false);
  const [temMadeira, setTemMadeira] = useState(false);
  const [valor, setValor] = useState(0);
  const [animando, setAnimando] = useState(false);

  const precoBase = 20;
  const precoBanheiro = 20;
  const precoQuarto = 30;
  const precoVidracas = 30;
  const precoMadeira = 40;

  useEffect(() => {
    let total = precoBase;
    total += banheiros * precoBanheiro;
    total += quartos * precoQuarto;
    if (temVidracas) total += precoVidracas;
    if (temMadeira) total += precoMadeira;

    setAnimando(true);
    setValor(total);
    const timeout = setTimeout(() => setAnimando(false), 300);
    return () => clearTimeout(timeout);
  }, [banheiros, quartos, temVidracas, temMadeira]);

  function handleSubmit() {
    if (tipoSelecionado === null) return alert("Selecione o tipo");

    setDados(prev => ({
      ...prev,
      limpeza: "Leve",
      tipo: tipos[tipoSelecionado],
      banheiros,
      quartos,
      temVidracas,
      temMadeira,
      valor
    }));

    router.push("/getway"); // tela de data/hora
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
    <div className={styles.backgroundPage}></div>
      <div className={styles.container}>
        <div className={`${styles.valorContainer} ${animando ? styles.animando : ""}`}>
          <strong>Valor:</strong> R$ {valor.toFixed(2)}
        </div>

        <h3 className={styles.title}>COMO É SEU LAR?</h3>
        <span className={styles.subtitle}>Clique no tipo de lar e quantidade de cômodos</span>

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
          <button className={styles.counterButton} onClick={() => setBanheiros(b => Math.max(1, b - 1))}> - </button>
          <span className={styles.counterLabel}>{banheiros} banheiro{banheiros > 1 ? "s" : ""}</span>
          <button className={styles.counterButton} onClick={() => setBanheiros(b => b + 1)}> + </button>
        </div>

        <div className={styles.counter}>
          <button className={styles.counterButton} onClick={() => setQuartos(q => Math.max(1, q - 1))}> - </button>
          <span className={styles.counterLabel}>{quartos} quarto{quartos > 1 ? "s" : ""}</span>
          <button className={styles.counterButton} onClick={() => setQuartos(q => q + 1)}> + </button>
        </div>

        <div className={styles.extraOptions}>
          <label className={styles.switch}>
            <input type="checkbox" checked={temVidracas} onChange={e => setTemVidracas(e.target.checked)} />
            <span className={styles.slider}></span>
            <span className={styles.switchText}>Possui vidraças ou varanda</span>
          </label>

          <label className={styles.switch}>
            <input type="checkbox" checked={temMadeira} onChange={e => setTemMadeira(e.target.checked)} />
            <span className={styles.slider}></span>
            <span className={styles.switchText}>Possui móveis de madeira</span>
          </label>
        </div>

        <button className={styles.buttonSubmit} onClick={handleSubmit}>Próximo</button>
      </div>
    </div>
  );
}
