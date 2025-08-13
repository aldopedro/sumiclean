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
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

app.post("/clientes/cadastro", async (req, res) => {
  const { nome, email, senha, endereco, numero, referencia } = req.body;
  if (!nome || !email || !senha || !endereco || !numero) {
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios" });
  }
  const hash = await bcrypt.hash(senha, 10);
  const result = await pool.query(
    "INSERT INTO clientes (nome, email, senha, endereco, numero, referencia) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, nome, email",
    [nome, email, hash, endereco, numero, referencia]
  );
  const user = result.rows[0];
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ user, token });
});

app.post("/clientes/login", async (req, res) => {
  const { email, senha } = req.body;
  const result = await pool.query("SELECT * FROM clientes WHERE email = $1", [email]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: "Email não encontrado" });
  const valido = await bcrypt.compare(senha, user.senha);
  if (!valido) return res.status(400).json({ message: "Senha incorreta" });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ user: { id: user.id, nome: user.nome, email: user.email }, token });
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

app.post("/agendamento", authMiddleware, async (req, res) => {
  const {
    limpeza, tipo, banheiros, quartos, temVidracas, temMadeira, valor, data, hora
  } = req.body;
  const result = await pool.query(
    `INSERT INTO agendamentos
    (cliente_id, limpeza, tipo, banheiros, quartos, tem_vidracas, tem_madeira, valor, data, hora)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [req.userId, limpeza, tipo, banheiros, quartos, temVidracas, temMadeira, valor, data || null, hora || null]
  );
  res.json(result.rows[0]);
});

app.get("/agendamento", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM agendamentos WHERE cliente_id = $1 ORDER BY criado_em DESC",
    [req.userId]
  );
  res.json(result.rows);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
