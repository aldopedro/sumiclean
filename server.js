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

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.userId = user.id;
    next();
  });
}

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
    if (result.rows.length === 0) return res.status(400).json({ error: "Email ou senha inválidos" });

    const cliente = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) return res.status(400).json({ error: "Email ou senha inválidos" });

    const token = jwt.sign({ id: cliente.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ id: cliente.id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

app.post("/agendamento", autenticarToken, async (req, res) => {
  try {
    const {
      limpeza,
      tipo,
      banheiros,
      quartos,
      temVidracas,
      temMadeira,
      valor,
      nome,
      endereco,
      numero,
      referencia,
      data,
      hora
    } = req.body;

    if (!limpeza || !tipo || !nome || !endereco || !numero || !data || !hora) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const result = await pool.query(
      `INSERT INTO agendamentos
      (cliente_id, limpeza, tipo, banheiros, quartos, tem_vidracas, tem_madeira, valor, nome, endereco, numero, referencia, data, hora)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        req.userId,
        limpeza,
        tipo,
        banheiros || 0,
        quartos || 0,
        temVidracas || false,
        temMadeira || false,
        valor || 0,
        nome,
        endereco,
        numero,
        referencia || "",
        data,
        hora
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

app.get("/getAgendamentos", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM agendamentos WHERE cliente_id = $1 ORDER BY data ASC, hora ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
