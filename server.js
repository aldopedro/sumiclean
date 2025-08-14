import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const app = express();

const corsOptions = {
  origin: "https://sumiclean.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/clientes", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: "Campos obrigatórios" });

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO clientes (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, hashedSenha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: "Campos obrigatórios" });

  try {
    const result = await pool.query("SELECT * FROM clientes WHERE email = $1", [email]);
    const cliente = result.rows[0];
    if (!cliente) return res.status(401).json({ error: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) return res.status(401).json({ error: "Senha inválida" });

    res.json({ id: cliente.id, nome: cliente.nome, email: cliente.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

app.post("/agendamento", async (req, res) => {
  const { cliente_id, limpeza, tipo, banheiros, quartos, temVidracas, temMadeira, valor, piso } = req.body;

  if (!cliente_id || !limpeza || !tipo) return res.status(400).json({ error: "Campos obrigatórios" });

  try {
    const result = await pool.query(
      `INSERT INTO agendamentos
        (cliente_id, limpeza, tipo, banheiros, quartos, tem_vidracas, tem_madeira, valor, piso)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [cliente_id, limpeza, tipo, banheiros, quartos, temVidracas, temMadeira, valor, piso]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

app.get("/getAgendamentos/:cliente_id", async (req, res) => {
  const { cliente_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM agendamentos
       WHERE cliente_id = $1
       ORDER BY data_agendamento ASC, hora_agendamento ASC`,
      [cliente_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
