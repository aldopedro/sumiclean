import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
};

app.use(cors(corsOptions));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "secreto_superseguro";

app.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha, endereco, numero, referencia } = req.body;

    if (!nome || !email || !senha || !endereco || !numero) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    const emailExistente = await pool.query("SELECT * FROM clientes WHERE email = $1", [email]);
    if (emailExistente.rows.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO clientes (nome, email, senha, endereco, numero, referencia) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email",
      [nome, email, hashedPassword, endereco, numero, referencia]
    );

    const cliente = result.rows[0];
    const token = jwt.sign({ id: cliente.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ id: cliente.id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Preencha email e senha" });
    }

    const result = await pool.query("SELECT * FROM clientes WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    const cliente = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    const token = jwt.sign({ id: cliente.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ id: cliente.id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
