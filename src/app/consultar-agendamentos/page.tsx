'use client'
import React, { useEffect, useState } from "react";

type Agendamento = {
  id: number;
  service: number;
  location: number;
  date: string;
  hour: string;
  address: string;
};

export default function Consult() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    <div>
      <h1>Consultar Agendamentos</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul>
          {agendamentos.map(a => (
            <li key={a.id}>
              <strong>Serviço:</strong> {a.service} | <strong>Local:</strong> {a.location} | <strong>Data:</strong> {a.date} | <strong>Hora:</strong> {a.hour} | <strong>Endereço:</strong> {a.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}