'use client'
import React, { useEffect, useState } from "react";
import styles from "./consult.module.css";
type Agendamento = {
  id: number;
  service: number;
  location: number;
  date: string;
  hour: string;
  address: string;
};

function getServiceLabel(service: number) {
  if (service === 1) return "Limpeza padrão";
  if (service === 2) return "Limpeza pesada";
  return "Desconhecido";
}

function getLocationLabel(location: number) {
  if (location === 1) return "Casa/Apartamento";
  if (location === 2) return "Empresa/Loja";
  if (location === 3) return "Prédio (Área comum)";
  return "Desconhecido";
}

export default function Consult() {
  function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  function handleBack() {
    window.location.href = '/home';
  }
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await fetch("https://sumiclean-q7p6.onrender.com/getAgendamento");
        const data = await response.json();
        setAgendamentos(data);
      } catch {
        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, []);

  return (
    <div className={styles.master}>
      <div className={styles.header}>
      <h1 className={styles.title}>Consultar Agendamentos</h1>
      <button className={styles.back} onClick={handleBack}>Voltar</button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul className={styles.main}>
          {agendamentos.map(a => (
            <li key={a.id} className={styles.mainInfo}>
              <strong>Serviço: {getServiceLabel(a.service)} </strong>
              <strong>Local: {getLocationLabel(a.location)}</strong>
              <strong>Data:  {formatarData(a.date)}</strong>
              <strong>Hora:  {a.hour}</strong>
              <strong>Endereço:  {a.address}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}