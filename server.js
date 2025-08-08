// server.js
import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const app = express();

const corsOptions = {
  origin: 'https://sumiclean.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

app.use(express.json());

app.post("/agendamento", async (req, res) => {
  const {
    limpeza,
    tipo,
    banheiros,
    quartos,
    nome,
    endereco,
    numero,
    referencia
  } = req.body;

  if (!limpeza || !tipo || !banheiros || !quartos || !nome || !endereco || !numero || !referencia) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO agendamentos 
        (limpeza, tipo, banheiros, quartos, nome, endereco, numero, referencia) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [limpeza, tipo, banheiros, quartos, nome, endereco, numero, referencia]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
