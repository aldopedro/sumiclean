'use client'
import React, { useEffect, useState } from "react";
import styles from './consult.module.css';

type Agendamento = {
  id: number;
  limpeza: string;
  tipo: string;
  banheiros: number;
  quartos: number;
  nome: string;
  endereco: string;
  numero: string;
  referencia: string;
  data: string;          // nova
  data_criacao: string;
};

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        const res = await fetch('https://sumiclean-q7p6.onrender.com/getAgendamentos');
        if (!res.ok) throw new Error('Erro ao carregar agendamentos');
        const data = await res.json();
        setAgendamentos(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAgendamentos();
  }, []);

  if (loading) return <p className={styles.loading}>Carregando agendamentos...</p>;
  if (error) return <p className={styles.error}>Erro: {error}</p>;

  return (
    <div className={styles.main}>
      <h2 className={styles.title}>Agendamentos</h2>
      {agendamentos.length === 0 ? (
        <p className={styles.noData}>Nenhum agendamento encontrado.</p>
      ) : (
        <ul className={styles.list}>
          {agendamentos.map((ag) => (
            <li key={ag.id} className={styles.card}>
              <p><strong>Limpeza:</strong> {ag.limpeza}</p>
              <p><strong>Tipo:</strong> {ag.tipo}</p>
              <p><strong>Banheiros:</strong> {ag.banheiros}</p>
              <p><strong>Quartos:</strong> {ag.quartos}</p>
              <p><strong>Nome:</strong> {ag.nome}</p>
              <p><strong>Endereço:</strong> {ag.endereco}, Nº {ag.numero}</p>
              <p><strong>Referência:</strong> {ag.referencia}</p>
              <p><strong>Data da Limpeza:</strong> {new Date(ag.data).toLocaleDateString('pt-BR')}</p>
              <p><strong>Data do Agendamento:</strong> {new Date(ag.data_criacao).toLocaleString('pt-BR')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
