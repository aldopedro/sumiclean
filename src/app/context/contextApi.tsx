'use client';
import React, { createContext, useState, useContext } from 'react';

type DadosAgendamento = {
  limpeza: string;
  tipo: string | null;
  banheiros: number;
  quartos: number;
  nome?: string;
  endereco?: string;
};

type AgendamentoContextType = {
  dados: DadosAgendamento;
  setDados: React.Dispatch<React.SetStateAction<DadosAgendamento>>;
};

const AgendamentoContext = createContext<AgendamentoContextType | undefined>(undefined);

export function AgendamentoProvider({ children }: { children: React.ReactNode }) {
  const [dados, setDados] = useState<DadosAgendamento>({
    limpeza: "",
    tipo: null,
    banheiros: 1,
    quartos: 1,
  });

  return (
    <AgendamentoContext.Provider value={{ dados, setDados }}>
      {children}
    </AgendamentoContext.Provider>
  );
}

export function useAgendamento() {
  const context = useContext(AgendamentoContext);
  if (!context) {
    throw new Error('useAgendamento deve ser usado dentro de um AgendamentoProvider');
  }
  return context;
}
